# Déploiement — VPS partagé (escalebetega.com)

Le VPS héberge déjà une autre application (**koby**, sert `cgsassurances.com`)
dans Docker, avec `koby_nginx` lié directement aux ports hôte 80/443. Cette
appli **ne doit jamais être modifiée** au-delà du seul changement décrit
ci-dessous (retrait de son binding de port host — son propre TLS, certs,
et logique interne restent identiques).

## Architecture

```
Internet ──80/443──> edge_nginx (SNI passthrough, /opt/edge)
                          │
              ┌───────────┴────────────┐
              │                        │
      koby_koby_net              edge_network
              │                        │
        koby_nginx              escale_caddy (TLS + ACME)
     (TLS inchangé)                    │
                                  escale_network
                                        │
                                  escale_nginx (HTTP interne)
                                        │
                                  escale_app (PHP-FPM)
                                   /        \
                          escale_mysql   escale_redis
```

`edge_nginx` ne déchiffre jamais le trafic de koby — il lit seulement le SNI
(nom de domaine dans le ClientHello TLS) pour router les octets bruts vers le
bon backend. Chaque appli garde la responsabilité de son propre certificat.

## 1. Réseau partagé (une seule fois)

```bash
docker network create edge_network
```

## 2. Déployer l'appli Escale Betega

```bash
mkdir -p /opt/apps/escale-betega
cd /opt/apps/escale-betega
git clone https://github.com/OddoMaxi/escalebetega.git .
cp .env.production.example .env
# éditer .env : APP_KEY, DB_PASSWORD, DB_ROOT_PASSWORD, INTERACT_SMS_USER/HASH
docker compose build
docker compose run --rm escale_app php artisan key:generate
docker compose up -d
docker compose exec escale_app php artisan db:seed
```

`RUN_MIGRATIONS=true` dans `docker-compose.yml` fait tourner les migrations
au démarrage du conteneur `escale_app`.

À ce stade, l'appli tourne mais n'est pas encore exposée publiquement (aucun
port host lié — `escale_caddy` n'est joignable que via `edge_network`).

## 3. Changement chez koby (une ligne, à valider explicitement)

Dans `/opt/koby/docker-compose.yml`, retirer uniquement le bloc `ports` du
service `nginx` :

```diff
   nginx:
     build:
       context: .
       dockerfile: nginx/Dockerfile
     container_name: koby_nginx
     restart: unless-stopped
-    ports:
-      - "80:80"
-      - "443:443"
     volumes:
       - /etc/letsencrypt:/etc/letsencrypt:ro
       - certbot_webroot:/var/www/certbot
     depends_on:
       - app
     networks:
       - koby_net
```

Puis :

```bash
cd /opt/koby
docker compose up -d nginx
```

Cela recrée uniquement le conteneur `koby_nginx` (quelques secondes
d'indisponibilité pour cgsassurances.com pendant le redémarrage). Rien
d'autre ne change : mêmes certificats, même image, même config nginx interne,
mêmes volumes.

**Vérifier immédiatement après** que `https://cgsassurances.com` répond
normalement avant de continuer.

## 4. Déployer l'edge router

```bash
mkdir -p /opt/edge
cp deploy/edge/* /opt/edge/
cd /opt/edge
docker compose up -d
```

## 5. Vérifications

```bash
curl -I https://cgsassurances.com
curl -I https://escalebetega.com
```

Les deux doivent répondre avec un certificat valide. Le premier accès à
`escalebetega.com` peut prendre quelques secondes de plus le temps que Caddy
obtienne son certificat Let's Encrypt automatiquement.

## Rollback

Si quelque chose ne va pas avec koby après l'étape 3 :

```bash
cd /opt/koby
git diff docker-compose.yml   # ou restaurer le fichier depuis la sauvegarde
docker compose up -d nginx
```

Le rollback ne dépend d'aucune donnée d'escale-betega — koby garde son volume
Postgres et ses certificats intacts tout du long.
