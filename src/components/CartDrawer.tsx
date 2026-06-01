'use client';

import { useCart, WHATSAPP_NUMBER } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    let messageText = `Olá! Gostaria de finalizar o pedido das seguintes semijoias na *May's Folheados*:\n\n`;

    cartItems.forEach((item) => {
      messageText += `🔹 *${item.quantity}x* ${item.product.name}\n`;
      messageText += `   _Valor:_ ${(item.product.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n\n`;
    });

    messageText += `💰 *Total do Pedido:* ${cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n\n`;
    messageText += `Gostaria de saber como prosseguir com o pagamento e entrega das minhas peças.`;

    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-100 flex justify-end" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Backdrop blur effect */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={closeCart}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#fff8f3] text-[#211b10] h-full shadow-2xl flex flex-col z-10 animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#d2c3c4]/20 bg-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#70585b]">shopping_bag</span>
            <h2 className="text-lg font-semibold font-sans">Seu Carrinho ({cartCount})</h2>
          </div>
          <button 
            onClick={closeCart}
            className="p-1 rounded-full hover:bg-[#fff8f3] transition-colors"
          >
            <span className="material-symbols-outlined text-2xl text-[#70585b]">close</span>
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <span className="material-symbols-outlined text-6xl text-[#70585b]/20 mb-4">shopping_bag</span>
              <p className="text-base font-medium text-[#4f4445] mb-2">Seu carrinho está vazio</p>
              <p className="text-sm text-[#4f4445]/60 mb-6">Que tal explorar nossas coleções e encontrar a peça perfeita?</p>
              <button 
                onClick={closeCart}
                className="px-6 py-2.5 bg-[#70585b] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#775a19] transition-colors active:scale-95"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.product.id} 
                className="flex gap-4 p-3 bg-white rounded-xl border border-[#d2c3c4]/20 shadow-sm relative group"
              >
                {/* Product Image */}
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="w-20 h-20 object-cover rounded-lg border border-[#d2c3c4]/20"
                />

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h4 className="text-sm font-semibold text-[#211b10] line-clamp-1">{item.product.name}</h4>
                    <p className="text-xs text-[#4f4445]/60 mt-0.5">{item.product.category}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#775a19]">
                      {(item.product.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#d2c3c4]/40 rounded-full bg-[#fff8f3]">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 text-[#70585b] hover:text-[#775a19]"
                      >
                        <span className="text-xs font-bold font-sans">-</span>
                      </button>
                      <span className="px-2 text-xs font-semibold font-sans">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 text-[#70585b] hover:text-[#775a19]"
                      >
                        <span className="text-xs font-bold font-sans">+</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="absolute top-2 right-2 p-1 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Remover item"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#d2c3c4]/20 bg-white px-6 py-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#4f4445]">Subtotal:</span>
              <span className="font-semibold text-[#211b10]">
                {cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            <div className="flex justify-between items-center text-base border-t border-[#d2c3c4]/10 pt-3">
              <span className="font-semibold text-[#211b10]">Total do Pedido:</span>
              <span className="font-bold text-[#775a19] text-lg">
                {cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-[#775a19] text-white py-4 rounded-full font-semibold uppercase tracking-wider text-xs hover:bg-[#70585b] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 2.02 14.12 1 11.503 1c-5.442 0-9.87 4.372-9.874 9.802-.001 1.73.466 3.42 1.353 4.927l-.994 3.63 3.769-.975zm11.368-7.393c-.273-.137-1.62-.8-1.87-.892-.252-.09-.435-.137-.617.137-.182.271-.706.892-.865 1.075-.16.182-.319.204-.592.068-.273-.137-1.15-.425-2.19-1.353-.808-.721-1.353-1.612-1.512-1.885-.16-.272-.017-.42.12-.556.123-.122.273-.319.41-.478.136-.16.182-.272.273-.453.09-.182.045-.34-.022-.477-.068-.137-.618-1.488-.847-2.036-.223-.532-.449-.46-.617-.468-.16-.008-.342-.01-.524-.01-.182 0-.478.068-.73.342-.25.273-.956.935-.956 2.278 0 1.343.979 2.637 1.116 2.82.137.182 1.928 2.946 4.672 4.129.653.282 1.162.451 1.558.577.656.208 1.253.179 1.724.11.524-.078 1.62-.663 1.85-1.302.23-.637.23-1.186.16-1.302-.07-.116-.253-.182-.524-.319z"/>
              </svg>
              Finalizar pelo WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
