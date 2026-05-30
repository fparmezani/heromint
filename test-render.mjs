import fetch from 'node-fetch';

async function testImageRendering() {
  console.log('Testing /api/generate endpoint...\n');

  const response = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      theme: 'futebol-2026',
      formData: { nome: 'Teste' },
      packageType: 'free'
    })
  });

  const data = await response.json();
  console.log('Response Status:', response.status);
  console.log('Is Mock:', data.isMock);
  console.log('Image URL (first 100 chars):', data.imageUrl?.substring(0, 100));
  console.log('Image URL is valid data URI:', data.imageUrl?.startsWith('data:image/'));

  // Test if SVG can be parsed
  if (data.imageUrl?.startsWith('data:image/svg+xml,')) {
    const svgPart = data.imageUrl.replace('data:image/svg+xml,', '');
    const decodedSvg = decodeURIComponent(svgPart);
    console.log('\n✓ Valid SVG data URI detected');
    console.log('Decoded SVG (first 200 chars):', decodedSvg.substring(0, 200));
  }
}

testImageRendering().catch(console.error);
