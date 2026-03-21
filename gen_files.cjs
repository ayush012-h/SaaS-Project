const fs = require('fs');

const files = [
  'src/pages/Settings/SettingsPage.jsx',
  'src/pages/Legal/TermsPage.jsx',
  'src/pages/Home/PricingPage.jsx',
  'src/pages/Home/LandingPageTarget.jsx',
  'src/pages/Home/LandingPage.jsx',
  'src/pages/Home/FeaturesPage.jsx',
  'src/lib/razorpay.js',
  'src/components/Layout/Sidebar.jsx',
  'src/components/UI/ProGate.jsx',
  'src/components/HelpPanel.jsx',
  'src/components/Layout/MobileHeader.jsx',
  'supabase/functions/send-email/index.ts'
];

let out = '# Complete Updated Files\n\n';

for (const file of files) {
  const content = fs.readFileSync('c:/Users/lenovo/OneDrive/Desktop/SaaS Project/' + file, 'utf8');
  out += '## ' + file + '\n';
  out += '```' + (file.endsWith('ts') ? 'typescript' : (file.endsWith('js') ? 'javascript' : 'jsx')) + '\n';
  out += content + '\n```\n\n';
}

fs.writeFileSync('C:/Users/lenovo/.gemini/antigravity/brain/9edc435b-c005-4012-9485-b4ae0d67ec47/artifacts/updated_files.md', out, 'utf8');
console.log('done');
