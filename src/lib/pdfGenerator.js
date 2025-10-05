import jsPDF from "jspdf";

export const generateDownloadPdf =  (report, userProfile) => {
    const gemini = report.geminiResponse || {};

  const docPdf = new jsPDF({ unit: 'pt', format: 'a4' });
  
  const pageWidth = docPdf.internal.pageSize.getWidth();
  const pageHeight = docPdf.internal.pageSize.getHeight();
  const margin = 40;
  let cursorY = 0;
      

      const colors = {
        primary: '#FF6B6B',
        text: '#334155',
        lightText: '#64748b',
        headerBg: '#f1f5f9',
        border: '#e2e8f0',
      };

      const reportDate = report.createdAt && report.createdAt.seconds 
    ? new Date(report.createdAt.seconds * 1000) 
    : new Date();
  
  const generatedDateTime = reportDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

      // --- HEADER ---
      docPdf.setFillColor(colors.headerBg);
      docPdf.rect(0, 0, pageWidth, 90, 'F');
      docPdf.setFont('helvetica', 'bold');
      docPdf.setFontSize(22);
      docPdf.setTextColor(colors.primary);
      docPdf.text('Predictive Diagnostic Report', pageWidth / 2, 55, { align: 'center' });

      //date and time
      docPdf.setFont('helvetica', 'normal');
      docPdf.setFontSize(10);
      docPdf.setTextColor(colors.lightText);
      docPdf.text(`Generated on: ${generatedDateTime}`, pageWidth / 2, 75, { align: 'center' });
      cursorY = 120;

      // --- HELPER FUNCTIONS FOR DRAWING ---
      const addSectionTitle = (title) => {
        if (cursorY > pageHeight - 80) { docPdf.addPage(); cursorY = margin; }
        docPdf.setFontSize(16);
        docPdf.setFont('helvetica', 'bold');
        docPdf.setTextColor(colors.text);
        docPdf.text(title, margin, cursorY);
        cursorY += 10;
        docPdf.setDrawColor(colors.border);
        docPdf.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 25;
      };

      const addSubheading = (title) => {
        if (cursorY > pageHeight - 60) { docPdf.addPage(); cursorY = margin; }
        docPdf.setFontSize(12);
        docPdf.setFont('helvetica', 'bold');
        docPdf.setTextColor(colors.text);
        docPdf.text(title, margin, cursorY);
        cursorY += 20;
      }

      const addKeyValue = (label, value) => {
        if (!value) return;
        docPdf.setFontSize(10);
        docPdf.setFont('helvetica', 'bold');
        docPdf.setTextColor(colors.lightText);
        docPdf.text(label, margin, cursorY);

        docPdf.setFont('helvetica', 'normal');
        docPdf.setTextColor(colors.lightText);
        docPdf.text(String(value), margin + 120, cursorY);
        cursorY += 20;
      };

        const addBullets = (items) => {
    if (!items) return;
    const list = Array.isArray(items) ? items : [items];
    const maxWidth = pageWidth - margin * 2 - 15; // Use full width for single column

    list.forEach(item => {
      const itemText = item.name || item;
      const lines = docPdf.splitTextToSize(itemText, maxWidth);
      
      // Check if there's enough space for the content AND the footer
      if (cursorY + (lines.length * 12) > pageHeight - margin - 70) {
        docPdf.addPage();
        cursorY = margin;
      }

      docPdf.setFontSize(14);
      docPdf.setTextColor(colors.primary);
      docPdf.text('•', margin, cursorY);

      docPdf.setFontSize(10);
      docPdf.setTextColor(colors.lightText);
      docPdf.text(lines, margin + 15, cursorY);
      
      // Move cursor down for the next bullet point
      cursorY += lines.length * 12 + 4; 
    });
    cursorY += 15; // Add extra space after the entire list
  };


      // --- PDF CONTENT ---
      
      // 1. User Profile
      addSectionTitle('User Profile');
      addKeyValue('Full Name', userProfile.name ? userProfile.name.toUpperCase() : 'N/A');
      addKeyValue('Age', userProfile.age);
      addKeyValue('Gender', userProfile.gender);
      cursorY += 20;

      // 2. Summary
      addSectionTitle('Summary');
      docPdf.setFont('helvetica', 'normal');
      docPdf.setFontSize(10);
      docPdf.setTextColor(colors.lightText);
      const summaryLines = docPdf.splitTextToSize(gemini.summaryReport || 'N/A', pageWidth - margin * 2);
      docPdf.text(summaryLines, margin, cursorY);
      cursorY += summaryLines.length * 12 + 30;

      // 3. Recommendations
      addSectionTitle('Detailed Recommendations');
      
      // Using a simplified bullet approach for better layout control\
      const recommendationSections = [
        { title: 'Diagnosis Results', items: gemini.predictedDisease },
        { title: 'Personalized Guidance', items: gemini.personalizedGuidance },
        { title: 'Prevention Strategies', items: gemini.preventionStrategies },
        { title: 'Recommended Exercise', items: gemini.recommendedExercise },
        { title: 'Nutrition Guidance', items: gemini.nutritionGuidance },
        { title: 'Precautionary Measures', items: gemini.precautionaryMeasures },
        { title: 'Home Remedies', items: gemini.homeRemedies },
      ];
      // ... you can add more sections here in the same way
      recommendationSections.forEach(section => {
        if (section.items && (Array.isArray(section.items) ? section.items.length > 0 : section.items)) {
          addSubheading(section.title);
          addBullets(section.items);
        }
      });
      // --- FOOTER ---
      const pageCount = docPdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
      docPdf.setPage(i);
    
    // Add page number to every page
    docPdf.setFontSize(8);
    docPdf.setTextColor(colors.lightText);
    const pageNumText = `Page ${i} of ${pageCount}`;
    docPdf.text(pageNumText, pageWidth - margin, pageHeight - 20, { align: 'right' });

      const footerY = pageHeight - 80; // Adjusted Y position for more content

      // Add separator line
      docPdf.setDrawColor(colors.border);
      docPdf.line(margin, footerY, pageWidth - margin, footerY);

      // Add disclaimer text
      docPdf.setFontSize(8);
      docPdf.setFont('helvetica', 'normal');
      docPdf.setTextColor(colors.lightText);
      const disclaimer = "Disclaimer: This content is AI-generated and for informational purposes only. Consult a healthcare professional before taking any medication or making medical decisions.";
      const disclaimerLines = docPdf.splitTextToSize(disclaimer, pageWidth - margin * 2);
      docPdf.text(disclaimerLines, margin, footerY + 15);

      // Add copyright text below disclaimer
      docPdf.setFontSize(7);
      const copyrightText = "© 2025 PREDICTIVE. All rights reserved.";
      docPdf.text(copyrightText, margin, pageHeight - 20);
  }

      // --- SAVE ---
      const filename = `Health_Report_${reportDate.toISOString().slice(0, 10)}.pdf`;
      docPdf.save(filename);

    };