export const businessInfo = {
  brandName: 'KAM',
  businessName: 'KAM Services',
  tagline: 'Developpement web, support informatique et accompagnement administratif',
  email: 'baryb9457@gmail.com',
  phone: '+33 06 05 54 74 63',
  location: "France et a l'international",
  legalDetails: {
    siret: '',
    address: '',
    legalStatus: '',
  },
};

export const businessIdentityLines = [
  businessInfo.businessName,
  businessInfo.email,
  businessInfo.phone,
  businessInfo.location,
  businessInfo.legalDetails.address,
  businessInfo.legalDetails.legalStatus,
  businessInfo.legalDetails.siret ? `SIRET: ${businessInfo.legalDetails.siret}` : '',
].filter(Boolean);

export const defaultDevisNotes = [
  'Nous vous remercions de votre confiance. Le présent devis, valable un mois à compter de sa date d\'émission, est établi sur la base des éléments communiqués à ce jour. La prestation débutera après réception de votre accord écrit.',
  'Le calendrier d\'intervention sera confirmé avant le démarrage, en tenant compte des spécificités de la mission ainsi que des disponibilités convenues.',
  'Sauf mention contraire figurant sur le présent devis, les modalités de règlement seront définies d\'un commun accord avant le début des travaux, avec la possibilité d\'un acompte à la commande et d\'un solde à la livraison ou selon l\'avancement du projet.',
  'Toute demande complémentaire, modification de périmètre ou prestation additionnelle pourra faire l\'objet d\'une révision tarifaire soumise à validation préalable.',
].join(' ');

export const devisLegalMentions = [
  'Le présent devis devient ferme et engageant après acceptation expresse du client, par signature, par la mention Bon pour accord ou par toute validation numérique non équivoque.',
  'À compter de cette acceptation, chacune des parties s\'engage à exécuter de bonne foi ses obligations respectives, conformément aux stipulations du devis et aux dispositions légales applicables.',
  'Toute condition particulière relative au paiement, aux délais, à la livraison, à la résiliation ou à d\'éventuelles pénalités devra être expressément précisée dans le devis accepté ou dans tout écrit complémentaire validé par les parties.',
  'En cas d\'inexécution, de retard ou de manquement contractuel, chaque partie conserve la faculté de faire valoir ses droits et de solliciter les mesures ou sanctions prévues par la loi ainsi que, le cas échéant, par les stipulations convenues.',
].join(' ');

export const emailJsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  contactTemplateId: import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  devisTemplateId: import.meta.env.VITE_EMAILJS_DEVIS_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

export const isEmailJsConfigured =
  Boolean(emailJsConfig.serviceId) &&
  Boolean(emailJsConfig.templateId) &&
  Boolean(emailJsConfig.publicKey);