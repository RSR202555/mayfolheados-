import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'A migração do banco de dados e imagens foi concluída com sucesso e este endpoint está desativado por segurança.',
  });
}
