export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'Anéis' | 'Colares' | 'Brincos' | 'Pulseiras' | 'Braceletes' | 'Correntes';
  material: 'Ouro 18k' | 'Rodio Branco';
  isNew?: boolean;
  isBestSeller?: boolean;
}

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Anel Minimalista Aura',
    price: 189.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2VRgSsTIWt3mHskacqJL02Kh3rcuxQMKjvCYxRW93qtZ7cgYFcpyrz9GDF6TS68wJc83oB_FO7w9UaiPzuknIsBmYXBtCa6oYJQRQx0iYe1AI4PMmGOYncPRFbkCSgyoH8f1u5eDNdARqxwpcoxmYFV4dKoSyweRGgxcq2dY5KJElLpB4dP98Kk7ANtesuk9BAY5Dtu2JSy3tNlw83nJma8ABT2L2ohJXODVuLgTM8Rx4olcSD9HZA26gY0JxyoSJvDEndkBkhSc',
    category: 'Anéis',
    material: 'Ouro 18k',
    isNew: true
  },
  {
    id: '2',
    name: 'Colar Elo Orgânico',
    price: 245.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBImyUIwzpD09yxjkL5ceTIfLtRncsu2YPQyJwU1cF8Gqz0KE_V3x9GUhZAhagX-k7vW8d0ILPU-GNKlpHpHcKFDIpc7zl3rmW_wmC3mGMjgxBBSexNBt5BotTPAQn9xOTVZlv9i19U1v7JLew7EOzdKmm-AwLhGZKIhHZeSJyFQZASkwMyFvf6iIUwm__tA09gUpkq6xjLknCxOBRJkcQD_pilqoKRFCiNOBFPPWWBlonGeThej1m6iOGRC0eLcQhy3DoodpzGEV8',
    category: 'Colares',
    material: 'Ouro 18k'
  },
  {
    id: '3',
    name: 'Brinco Infinito Gold',
    price: 156.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFde141VtznoCoGHNRGOWQtzm_Ms-DeYNekYMwoNM_X_BxnLY8S_8lmCvUhLvEBltgLbI7Z3MyfBsJT3ZY_OblU9v5AXcdH9awCWZELHHt2_PtsUhtcOp7ZFR9SFWri1DKfidFQMnSpN0MClTeUhAtqdi5zDsr-j3IBOnv7L9y-cGTF7iUqICauucDUZjSOZOORY9Ep_g8JwSGDBo1UNBCRnVSB-3n-QSsmNfCXZjUqNxT4yhvwlhqzryM3PzYRFX744ZVQX_MVb8',
    category: 'Brincos',
    material: 'Ouro 18k',
    isBestSeller: true
  },
  {
    id: '4',
    name: 'Bracelete Riviera Slim',
    price: 312.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrtrpAdhAxJ5EGsO66i17C-cwHFfurpvlIS-yClH4iKmO1TgzxaAMEdMLiHClaKGIBgLf5jqwVISad00ezhEziNLYdYqSHSui71mvZmppnsU2dD9tPsRNJX0Wg0-i-vodkjKiKNHD22-1nY3gyFNpDOnRH1qsy2g_daZrThRhW0W5g_xxA2XiyT7EBiw5bL4fuf13tnTjiq2lXe5aQTYl1ZdFFqh55XR_-iPqbt-5kHANRQbQls1yNDD-8egUAPyslwF0EqYwGU6g',
    category: 'Pulseiras',
    material: 'Rodio Branco'
  }
];
