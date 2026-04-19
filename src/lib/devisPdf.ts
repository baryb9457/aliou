import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { DevisItem, DevisStatus } from '../types';
import { businessIdentityLines, businessInfo, defaultDevisNotes, devisLegalMentions } from './business';

interface DevisPdfData {
  id?: string;
  clientName: string;
  clientEmail: string;
  items: DevisItem[];
  totalAmount: number;
  notes?: string;
  status?: DevisStatus;
  createdAt?: string;
}

function buildReference(data: DevisPdfData) {
  const date = new Date(data.createdAt ?? Date.now()).toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = data.id ? data.id.slice(0, 6).toUpperCase() : 'BROUILLON';
  return `DEV-${date}-${suffix}`;
}

function drawLogo(doc: jsPDF, x: number, y: number) {
  doc.setFillColor(13, 148, 136);
  doc.roundedRect(x, y, 24, 24, 4, 4, 'F');
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.4);
  doc.roundedRect(x + 1.2, y + 1.2, 21.6, 21.6, 3.2, 3.2, 'S');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('KAM', x + 4.5, y + 14.5);
}

export function downloadDevisPdf(data: DevisPdfData) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const reference = buildReference(data);
  const issueDate = new Date(data.createdAt ?? Date.now()).toLocaleDateString('fr-FR');

  drawLogo(doc, 14, 14);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(businessInfo.businessName, 42, 23);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(businessInfo.tagline, 42, 29);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('DEVIS', 145, 26);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Reference: ${reference}`, 145, 34);
  doc.text(`Date: ${issueDate}`, 145, 39);
  doc.text(`Statut: ${data.status ?? 'draft'}`, 145, 44);

  doc.setDrawColor(203, 213, 225);
  doc.line(14, 50, 196, 50);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Emetteur', 14, 54);
  doc.text('Client', 110, 54);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(businessIdentityLines, 14, 60);

  doc.text(
    [
      data.clientName,
      data.clientEmail,
    ],
    110,
    60,
  );

  autoTable(doc, {
    startY: 86,
    head: [['Description', 'Quantite', 'Prix unitaire', 'Montant']],
    body: data.items.map((item) => [
      item.description,
      String(item.quantity),
      item.unit_price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
      (item.quantity * item.unit_price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
    ]),
    headStyles: {
      fillColor: [13, 148, 136],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: [15, 23, 42],
    },
    alternateRowStyles: {
      fillColor: [240, 253, 250],
    },
    styles: {
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
      cellPadding: 3,
      fontSize: 9,
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 120;

  doc.setFillColor(240, 253, 250);
  doc.roundedRect(120, finalY + 6, 76, 20, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Total HT', 126, finalY + 14);
  doc.setFontSize(14);
  doc.text(
    data.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
    126,
    finalY + 22,
  );

  let cursorY = finalY + 36;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Conditions et remarques', 14, cursorY);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  const notesText = doc.splitTextToSize(data.notes?.trim() || defaultDevisNotes, 182);
  doc.text(notesText, 14, cursorY + 6);

  cursorY += 10 + notesText.length * 4.3;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Mentions contractuelles', 14, cursorY);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  const legalText = doc.splitTextToSize(devisLegalMentions, 182);
  doc.text(legalText, 14, cursorY + 5);

  // Signature block
  cursorY += 8 + legalText.length * 3.5;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, cursorY + 4, 80, cursorY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Signature du client', 14, cursorY + 10);

  // Signature info section
  const signatureY = cursorY + 18;
  doc.setFontSize(9);
  doc.text('Lieu: ...........................', 14, signatureY);
  doc.text('Date: ...........................', 14, signatureY + 8);
  doc.text('Nom: ...........................', 14, signatureY + 16);

  doc.setDrawColor(203, 213, 225);
  doc.line(14, 274, 196, 274);
  doc.setFontSize(8);
  doc.text(businessIdentityLines.slice(0, 3).join(' - '), 14, 280);

  doc.save(`${reference}.pdf`);
}