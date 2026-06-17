export const exportReportPdf = (report, state) => {
  if (!window.jspdf?.jsPDF) {
    throw new Error('Biblioteca jsPDF indisponível no momento.');
  }

  const doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
  const margin = 16;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 18;

  const addFooter = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(105, 113, 128);
    doc.text('Versão pública de portfólio - proposta acadêmica para acompanhamento de estágios.', margin, pageHeight - 10);
  };

  doc.setTextColor(23, 32, 51);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(report.title, margin, y);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(report.subtitle, margin, y);
  doc.text(`Emitido em ${new Intl.DateTimeFormat('pt-BR').format(new Date())}`, pageWidth - margin, y, { align: 'right' });

  y += 12;
  report.lines.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), margin + 55, y);
    y += 7;
  });

  report.sections.forEach((section) => {
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(section.title, margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const items = section.items.length ? section.items : ['Nenhum registro encontrado para os filtros aplicados.'];
    items.forEach((item) => {
      const lines = doc.splitTextToSize(`- ${item}`, pageWidth - margin * 2);

      if (y + lines.length * 5 > pageHeight - 18) {
        addFooter();
        doc.addPage();
        doc.setTextColor(23, 32, 51);
        y = 18;
      }

      doc.text(lines, margin, y);
      y += lines.length * 5 + 2;
    });
  });

  y += 4;
  doc.setFontSize(9);
  doc.setTextColor(105, 113, 128);
  doc.text(doc.splitTextToSize(state.project.privacyNotice, pageWidth - margin * 2), margin, Math.min(y, pageHeight - 24));
  addFooter();

  const filename = report.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll(' ', '-');

  doc.save(`stageflow-${filename}.pdf`);
};
