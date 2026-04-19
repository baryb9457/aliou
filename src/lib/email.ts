import emailjs from '@emailjs/browser';
import type { ServiceType, DevisItem, DevisStatus } from '../types';
import { businessInfo, emailJsConfig, isEmailJsConfigured } from './business';

interface ContactNotificationPayload {
  name: string;
  email: string;
  phone: string;
  service_type: ServiceType;
  message: string;
}

interface DevisNotificationPayload {
  clientName: string;
  clientEmail: string;
  items: DevisItem[];
  totalAmount: number;
  notes?: string;
  status?: DevisStatus;
  createdAt?: string;
  reference: string;
}

const serviceLabels: Record<ServiceType, string> = {
  web: 'Developpement Web',
  it: 'Support Informatique',
  admin: 'Gestion Administrative',
  other: 'Autre',
};

const CONTACT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

async function sendWithTemplateFallback(
  primaryTemplateId: string,
  payload: Record<string, unknown>,
  fallbackTemplateId?: string,
) {
  try {
    await emailjs.send(
      emailJsConfig.serviceId,
      primaryTemplateId,
      payload,
      {
        publicKey: emailJsConfig.publicKey,
      },
    );
    return;
  } catch (primaryError) {
    const canFallback = Boolean(
      fallbackTemplateId &&
      fallbackTemplateId.trim() &&
      fallbackTemplateId !== primaryTemplateId,
    );

    if (!canFallback) {
      throw primaryError;
    }

    await emailjs.send(
      emailJsConfig.serviceId,
      fallbackTemplateId as string,
      payload,
      {
        publicKey: emailJsConfig.publicKey,
      },
    );
  }
}

function isValidContactPayload(payload: ContactNotificationPayload) {
  const name = payload.name.trim();
  const email = payload.email.trim().toLowerCase();
  const message = payload.message.trim();

  return name.length >= 2 && CONTACT_EMAIL_REGEX.test(email) && !email.includes('..') && message.length >= 20;
}

export async function sendContactNotification(payload: ContactNotificationPayload) {
  if (!isEmailJsConfigured) {
    return { sent: false, skipped: true };
  }

  if (!isValidContactPayload(payload)) {
    return { sent: false, skipped: true, reason: 'invalid_payload' };
  }

  const templatePayload = {
    to_email: businessInfo.email,
    to_name: businessInfo.businessName,
    from_name: payload.name,
    from_email: payload.email,
    reply_to: payload.email,
    phone: payload.phone || 'Non renseigne',
    service: serviceLabels[payload.service_type],
    service_type: payload.service_type,
    message: payload.message,
    subject: `Nouvelle demande client - ${serviceLabels[payload.service_type]}`,
    company_name: businessInfo.businessName,
  };

  await sendWithTemplateFallback(
    emailJsConfig.contactTemplateId,
    templatePayload,
    emailJsConfig.templateId,
  );

  return { sent: true, skipped: false };
}

export async function sendDevisNotification(payload: DevisNotificationPayload) {
  if (!isEmailJsConfigured) {
    return { sent: false, skipped: true };
  }

  const itemsText = payload.items
    .map((item) => `- ${item.description}: ${item.quantity} x ${item.unit_price}€ = ${item.quantity * item.unit_price}€`)
    .join('\n');

  const devisDate = new Date(payload.createdAt ?? Date.now()).toLocaleDateString('fr-FR');

  const templatePayload = {
    to_email: businessInfo.email,
    to_name: businessInfo.businessName,
    from_name: payload.clientName,
    from_email: payload.clientEmail,
    reply_to: payload.clientEmail,
    phone: 'Devis client',
    service: `Devis ${payload.reference}`,
    service_type: 'other',
    message: `Nouveau devis pour ${payload.clientName} (${payload.clientEmail})\n\n${itemsText}\n\nTotal: ${payload.totalAmount}€\nDate: ${devisDate}\nStatut: ${payload.status ?? 'draft'}\n\nNotes:\n${payload.notes || 'Aucune note'}`,
    subject: `Nouveau devis - ${payload.reference} - ${payload.clientName}`,
    company_name: businessInfo.businessName,
  };

  await sendWithTemplateFallback(
    emailJsConfig.devisTemplateId,
    templatePayload,
    emailJsConfig.templateId,
  );

  return { sent: true, skipped: false };
}