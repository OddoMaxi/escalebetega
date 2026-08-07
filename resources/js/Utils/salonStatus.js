export const SALON_STATUS_META = {
    libre: { label: 'Libre', classes: 'bg-success/10 text-success border-success/20' },
    occupe: { label: 'Occupé', classes: 'bg-sun/15 text-wood border-sun/30' },
    nouvelle_commande: { label: 'Nouvelle commande', classes: 'bg-danger/10 text-danger border-danger/20' },
    en_preparation: { label: 'En préparation', classes: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    prete: { label: 'Prête', classes: 'bg-forest/10 text-forest border-forest/20' },
    a_encaisser: { label: 'À encaisser', classes: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
};

export function salonStatusMeta(status) {
    return SALON_STATUS_META[status] ?? SALON_STATUS_META.libre;
}
