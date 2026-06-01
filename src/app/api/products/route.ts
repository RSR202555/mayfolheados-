import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the path to the products JSON file
const jsonFilePath = path.join(process.cwd(), 'src/data/products.json');
const uploadDir = path.join(process.cwd(), 'public/produtos');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper to read products
function readProducts() {
  try {
    if (!fs.existsSync(jsonFilePath)) {
      return [];
    }
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products JSON:', error);
    return [];
  }
}

// Helper to write products
function writeProducts(products: any[]) {
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing products JSON:', error);
    return false;
  }
}

export async function GET() {
  const products = readProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const isNew = formData.get('isNew') === 'true';
    const isBestSeller = formData.get('isBestSeller') === 'true';
    const imageFile = formData.get('imageFile') as File | null;
    const imageUrlInput = formData.get('imageUrl') as string | null;

    if (!name || isNaN(price) || !category) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes ou inválidos.' }, { status: 400 });
    }

    let imageUrl = '';

    // Handle file upload if present
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileExt = path.extname(imageFile.name) || '.jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);
      
      fs.writeFileSync(filePath, buffer);
      imageUrl = `/produtos/${fileName}`;
    } else if (imageUrlInput) {
      imageUrl = imageUrlInput;
    } else {
      // Default placeholder if no image provided
      imageUrl = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop';
    }

    const products = readProducts();
    
    const newProduct = {
      id: `${Date.now()}`,
      name,
      price,
      image: imageUrl,
      category,
      isNew,
      isBestSeller
    };

    products.push(newProduct);
    writeProducts(products);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json({ error: 'Erro interno ao salvar produto.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const isNew = formData.get('isNew') === 'true';
    const isBestSeller = formData.get('isBestSeller') === 'true';
    const imageFile = formData.get('imageFile') as File | null;
    const imageUrlInput = formData.get('imageUrl') as string | null;

    if (!id || !name || isNaN(price) || !category) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes ou inválidos.' }, { status: 400 });
    }

    let products = readProducts();
    const productIndex = products.findIndex((p: any) => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
    }

    const existingProduct = products[productIndex];
    let imageUrl = existingProduct.image;

    // Handle file upload if present
    if (imageFile && imageFile.size > 0) {
      // Try to delete old local image if it starts with /produtos/
      if (existingProduct.image.startsWith('/produtos/')) {
        const oldImagePath = path.join(process.cwd(), 'public', existingProduct.image);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error('Error deleting old product image file:', err);
          }
        }
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileExt = path.extname(imageFile.name) || '.jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);
      
      fs.writeFileSync(filePath, buffer);
      imageUrl = `/produtos/${fileName}`;
    } else if (imageUrlInput) {
      imageUrl = imageUrlInput;
    }

    products[productIndex] = {
      ...existingProduct,
      name,
      price,
      image: imageUrl,
      category,
      isNew,
      isBestSeller
    };

    writeProducts(products);

    return NextResponse.json({ success: true, product: products[productIndex] });
  } catch (error) {
    console.error('Error in PUT /api/products:', error);
    return NextResponse.json({ error: 'Erro interno ao editar produto.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do produto não fornecido.' }, { status: 400 });
    }

    let products = readProducts();
    const productToDelete = products.find((p: any) => p.id === id);

    if (!productToDelete) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
    }

    // Try to delete local image if it starts with /produtos/
    if (productToDelete.image.startsWith('/produtos/')) {
      const imagePath = path.join(process.cwd(), 'public', productToDelete.image);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error('Error deleting product image file:', err);
        }
      }
    }

    products = products.filter((p: any) => p.id !== id);
    writeProducts(products);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/products:', error);
    return NextResponse.json({ error: 'Erro interno ao excluir produto.' }, { status: 500 });
  }
}
