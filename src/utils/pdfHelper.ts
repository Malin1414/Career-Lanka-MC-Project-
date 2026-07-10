import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import { CVData } from '../types';

export const generateCVHtml = (cvData: CVData) => {
  const skillsHtml = cvData.skills.map(s => `<li>${s}</li>`).join('');
  const langsHtml = cvData.languages && cvData.languages.length > 0
    ? `<div class="section-title">LANGUAGES</div><ul>` + cvData.languages.map(l => `<li>${l}</li>`).join('') + `</ul>`
    : '';
  const certsHtml = cvData.certifications && cvData.certifications.length > 0
    ? `<div class="section-title">CERTIFICATIONS</div><ul>` + cvData.certifications.map(c => `<li>${c}</li>`).join('') + `</ul>`
    : '';
    
  const educationHtml = cvData.education && cvData.education.length > 0
    ? `<div class="section-title">EDUCATION</div>` + cvData.education.map(edu => `
        <div class="block">
          <div class="block-header">
            <span class="block-title">${edu.institution}</span>
            <span class="block-date">${edu.period}</span>
          </div>
          <div class="block-sub">${edu.degree} ${edu.gpa ? `(GPA: ${edu.gpa})` : ''}</div>
          ${edu.achievements ? `<div class="block-desc">${edu.achievements}</div>` : ''}
        </div>
      `).join('')
    : '';

  const experienceHtml = cvData.experience && cvData.experience.length > 0
    ? `<div class="section-title">EXPERIENCE</div>` + cvData.experience.map(exp => `
        <div class="block">
          <div class="block-header">
            <span class="block-title">${exp.company}</span>
            <span class="block-date">${exp.period}</span>
          </div>
          <div class="block-sub">${exp.role}</div>
          <div class="block-desc">${exp.description}</div>
        </div>
      `).join('')
    : '';

  const projectsHtml = cvData.projects && cvData.projects.length > 0
    ? `<div class="section-title">FEATURED PROJECTS</div>` + cvData.projects.map(proj => `
        <div class="block">
          <div class="block-header">
            <span class="block-title">${proj.name}</span>
            <span class="block-date">${proj.role}</span>
          </div>
          ${proj.link ? `<div class="block-link">${proj.link}</div>` : ''}
          <div class="block-tech">Tech Stack: ${proj.techStack}</div>
          <div class="block-desc">${proj.description}</div>
        </div>
      `).join('')
    : '';

  const referencesHtml = cvData.references
    ? `<div class="section-title">REFERENCES</div><div class="references-text">${cvData.references}</div>`
    : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${cvData.fullName} CV</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1F2937;
            margin: 0;
            padding: 0;
            font-size: 11px;
            line-height: 1.4;
          }
          .header {
            text-align: center;
            margin-bottom: 15px;
          }
          .name {
            font-size: 22px;
            font-weight: bold;
            color: #111827;
            margin: 0;
          }
          .headline {
            font-size: 13px;
            font-weight: bold;
            color: #05C48F;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 4px 0 8px 0;
          }
          .contact-info {
            font-size: 10px;
            color: #4B5563;
            margin-bottom: 4px;
          }
          .contact-info span {
            margin: 0 5px;
          }
          .divider {
            height: 1px;
            background-color: #D1D5DB;
            margin: 10px 0;
          }
          .columns {
            display: flex;
            justify-content: space-between;
          }
          .left-col {
            width: 30%;
            border-right: 1px solid #E5E7EB;
            padding-right: 15px;
          }
          .right-col {
            width: 66%;
          }
          .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #111827;
            border-bottom: 1.5px solid #05C48F;
            padding-bottom: 2px;
            margin-top: 15px;
            margin-bottom: 8px;
            letter-spacing: 0.8px;
          }
          .left-col .section-title {
            margin-top: 10px;
          }
          ul {
            list-style-type: none;
            padding-left: 0;
            margin: 0;
          }
          li {
            margin-bottom: 4px;
            color: #374151;
          }
          .block {
            margin-bottom: 10px;
          }
          .block-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
          }
          .block-title {
            color: #1F2937;
            font-size: 11px;
          }
          .block-date {
            color: #6B7280;
            font-size: 9px;
          }
          .block-sub {
            font-weight: 600;
            color: #4B5563;
            margin-top: 1px;
            font-size: 10px;
          }
          .block-desc {
            color: #4B5563;
            font-size: 9px;
            margin-top: 2px;
          }
          .block-link {
            color: #05C48F;
            font-size: 9px;
            margin-top: 1px;
          }
          .block-tech {
            font-weight: 600;
            color: #1F2937;
            font-size: 9px;
            margin-top: 1px;
          }
          .references-text {
            font-style: italic;
            color: #4B5563;
          }
          .summary-text {
            color: #374151;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${cvData.fullName}</div>
          <div class="headline">${cvData.title}</div>
          <div class="contact-info">
            ${cvData.email ? `<span>Email: ${cvData.email}</span>` : ''}
            ${cvData.phone ? `<span>Phone: ${cvData.phone}</span>` : ''}
            ${cvData.address ? `<span>Loc: ${cvData.address}</span>` : ''}
          </div>
          <div class="contact-info">
            ${cvData.github ? `<span>GitHub: ${cvData.github}</span>` : ''}
            ${cvData.linkedin ? `<span>LinkedIn: ${cvData.linkedin}</span>` : ''}
          </div>
        </div>
        <div class="divider"></div>
        <div class="columns">
          <div class="left-col">
            <div class="section-title">SKILLS</div>
            <ul>
              ${skillsHtml}
            </ul>
            ${langsHtml}
            ${certsHtml}
          </div>
          <div class="right-col">
            ${cvData.summary ? `<div class="section-title">SUMMARY</div><div class="summary-text">${cvData.summary}</div>` : ''}
            ${educationHtml}
            ${experienceHtml}
            ${projectsHtml}
            ${referencesHtml}
          </div>
        </div>
      </body>
    </html>
  `;
};

export const downloadPDF = async (cvData: CVData, setDownloading: (d: boolean) => void) => {
  try {
    setDownloading(true);
    const html = generateCVHtml(cvData);
    const { uri } = await Print.printToFileAsync({ html });
    
    const filename = `${cvData.fullName.replace(/\s+/g, '_')}_CV.pdf`;
    
    if (Platform.OS === 'android') {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64Content = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        const newFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          'application/pdf'
        );
        await FileSystem.writeAsStringAsync(newFileUri, base64Content, { encoding: FileSystem.EncodingType.Base64 });
        Alert.alert('Success', 'Your CV has been successfully downloaded.');
      } else {
        await Sharing.shareAsync(uri);
      }
    } else {
      await Sharing.shareAsync(uri);
      Alert.alert('Success', 'Your CV has been successfully generated.');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to generate and download PDF.');
  } finally {
    setDownloading(false);
  }
};

export const shareCV = async (cvData: CVData, setSharing: (s: boolean) => void) => {
  try {
    setSharing(true);
    const html = generateCVHtml(cvData);
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share my CareerLanka CV',
        UTI: 'com.adobe.pdf'
      });
    } else {
      Alert.alert('Error', 'Sharing is not available on this device.');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to share CV.');
  } finally {
    setSharing(false);
  }
};
