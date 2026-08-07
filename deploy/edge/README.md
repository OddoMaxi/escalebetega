# Edge router

Shared infrastructure for this VPS — routes incoming traffic on ports 80/443
to the right app by hostname, without touching how any individual app
terminates its own TLS. Lives at `/opt/edge` on the server, independent from
any single app's deploy lifecycle (do not delete it when redeploying
escale-betega or any other app).

- Port 443: SNI passthrough (`ssl_preread`, no decryption) — each backend
  keeps handling its own certificate exactly as before.
- Port 80: plain HTTP, routed by `Host` header — needed for ACME HTTP-01
  challenges and http→https redirects, still handled by each backend.

Requires the `edge_network` Docker network to exist (`docker network create
edge_network`) and the target app's containers to be reachable on it, plus
external access to the existing app's own network (e.g. `koby_koby_net`) for
containers this stack didn't create.

See `../../docs/DEPLOYMENT.md` for the full setup, including the one-line
change required in the existing app's compose file.
