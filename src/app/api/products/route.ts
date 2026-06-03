import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { put, del } from '@vercel/blob';

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    
    // Format columns to match camelCase expectations in frontend
    const formattedProducts = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),
      image: row.image,
      category: row.category,
      isNew: row.is_new,
      isBestSeller: row.is_best_seller,
    }));
    
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products from database:', error);
    // If the database is not initialized yet, return empty list
    return NextResponse.json([]);
  }
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
      // Upload file directly to Vercel Blob
      const blob = await put(`produtos/${Date.now()}-${imageFile.name}`, imageFile, {
        access: 'public',
      });
      imageUrl = blob.url;
    } else if (imageUrlInput) {
      imageUrl = imageUrlInput;
    } else {
      // Default placeholder if no image provided
      imageUrl = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop';
    }

    const id = `${Date.now()}`;

    await sql`
      INSERT INTO products (id, name, price, image, category, is_new, is_best_seller, created_at)
      VALUES (${id}, ${name}, ${price}, ${imageUrl}, ${category}, ${isNew}, ${isBestSeller}, NOW())
    `;

    return NextResponse.json({ 
      success: true, 
      product: { id, name, price, image: imageUrl, category, isNew, isBestSeller } 
    });
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

    // Fetch the existing product to retrieve its current image
    const { rows } = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
    }

    const existingProduct = rows[0];
    let imageUrl = existingProduct.image;

    // Handle file upload if present
    if (imageFile && imageFile.size > 0) {
      // Try to delete old Vercel Blob image to free space
      if (existingProduct.image && existingProduct.image.includes('public.blob.vercel-storage.com')) {
        try {
          await del(existingProduct.image);
        } catch (err) {
          console.error('Error deleting old product image file from blob:', err);
        }
      }

      // Upload the new image to Vercel Blob
      const blob = await put(`produtos/${Date.now()}-${imageFile.name}`, imageFile, {
        access: 'public',
      });
      imageUrl = blob.url;
    } else if (imageUrlInput) {
      imageUrl = imageUrlInput;
    }

    await sql`
      UPDATE products
      SET name = ${name}, price = ${price}, image = ${imageUrl}, category = ${category}, is_new = ${isNew}, is_best_seller = ${isBestSeller}
      WHERE id = ${id}
    `;

    return NextResponse.json({ 
      success: true, 
      product: { id, name, price, image: imageUrl, category, isNew, isBestSeller } 
    });
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

    // Fetch the product first to obtain the image URL
    const { rows } = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
    }
    const productToDelete = rows[0];

    // Delete image from Vercel Blob if applicable
    if (productToDelete.image && productToDelete.image.includes('public.blob.vercel-storage.com')) {
      try {
        await del(productToDelete.image);
      } catch (err) {
        console.error('Error deleting product image file from blob:', err);
      }
    }

    // Delete database entry
    await sql`DELETE FROM products WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/products:', error);
    return NextResponse.json({ error: 'Erro interno ao excluir produto.' }, { status: 500 });
  }
}
