Modeles EmailJS a copier-coller

(reception message client)


{{subject}}

Entreprise destinataire: {{to_name}}
Email destinataire: {{to_email}}

Nom du client: {{from_name}}
Email du client: {{from_email}}
Reply-to: {{reply_to}}
Telephone: {{phone}}
Service: {{service}}
Type service: {{service_type}}

{{message}}

{{company_name}}

(notification devis)

{{subject}}

Entreprise destinataire: {{to_name}}
Email destinataire: {{to_email}}

Client: {{from_name}}
Email client: {{from_email}}
Reply-to: {{reply_to}}
Reference/Service: {{service}}
Type service: {{service_type}}

{{message}}

{{company_name}}

Variables attendues par le code

- to_email
- to_name
- from_name
- from_email
- reply_to
- phone
- service
- service_type
- message
- subject
- company_name

Ou les trouver dans le projet

- Envoi contact: src/lib/email.ts
- Envoi devis: src/lib/email.ts
- Variables .env: .env

Configuration conseillee dans .env

VITE_EMAILJS_SERVICE_ID=ton_service_id
VITE_EMAILJS_CONTACT_TEMPLATE_ID=ton_template_contact
VITE_EMAILJS_DEVIS_TEMPLATE_ID=ton_template_devis
VITE_EMAILJS_PUBLIC_KEY=ta_public_key
VITE_EMAILJS_TO_EMAIL=ton_email_de_reception
