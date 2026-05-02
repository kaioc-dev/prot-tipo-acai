// Dados do Cardápio
const products = [
    { id: 'playzinho', name: 'Playzinho', price: 12, limit: 1, desc: '1 opção de cada item' },
    { id: 'playzao', name: 'Playzão', price: 20, limit: 2, desc: 'Até 2 opções de cada item' },
    { id: 'playtop', name: 'Playtop', price: 30, limit: 3, desc: 'Até 3 opções de cada item' },
    { id: 'playturbo', name: 'Playturbo', price: 45, limit: 4, desc: 'Até 4 opções de cada item' }
];

const components = [
    { id: 'cremes', name: 'Cremes', items: ['Açaí', 'Cupuaçu', 'Ninho'] },
    { id: 'frutas', name: 'Frutas', items: ['Morango', 'Banana', 'Manga', 'Maçã', 'Kiwi', 'Uva'] },
    { id: 'caldas', name: 'Caldas', items: ['Morango', 'Chocolate', 'Leite condensado'] },
    { id: 'graos', name: 'Grãos', items: ['Granola', 'Paçoca', 'Amendoim', 'Sucrilhos'] },
    { id: 'cereais', name: 'Cereais', items: ['Leite em pó', 'Farinha Láctea'] }
];

const paidExtras = [
    { id: 'nutella', name: 'Nutella', price: 5 },
    { id: 'pacoca_extra', name: 'Paçoca (Porção Extra)', price: 2 }
];

// Variáveis de Estado
let cart = [];
let currentProduct = null;
let currentExtrasCost = 0;

// Inicializa a tela
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('products-container');
    products.forEach(p => {
        container.innerHTML += `
            <div class="product-card" onclick="openProductModal('${p.id}')">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>${p.desc}</p>
                    <span class="price">R$ ${p.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <div style="color: var(--acai-purple);"><i class="fas fa-plus-circle fa-2x"></i></div>
            </div>
        `;
    });
});

// Abre Modal do Produto
function openProductModal(productId) {
    currentProduct = products.find(p => p.id === productId);
    currentExtrasCost = 0;
    
    document.getElementById('modal-title').innerText = currentProduct.name;
    document.getElementById('modal-desc').innerText = `Escolha até ${currentProduct.limit} opção(ões) de cada.`;
    updateModalPrice();

    let html = '';
    
    // Renderiza categorias gratuitas
    components.forEach(cat => {
        html += `<div class="category-group">
            <h4>${cat.name} (Até ${currentProduct.limit})</h4>`;
        cat.items.forEach(item => {
            html += `
                <div class="option-item">
                    <input type="checkbox" name="${cat.id}" value="${item}" id="${cat.id}_${item}" onchange="checkLimit(this, '${cat.id}', ${currentProduct.limit})">
                    <label for="${cat.id}_${item}">${item}</label>
                </div>
            `;
        });
        html += `</div>`;
    });

    // Renderiza adicionais pagos
    html += `<div class="category-group"><h4>Adicionais Pagos (Sem limite)</h4>`;
    paidExtras.forEach(extra => {
        html += `
            <div class="option-item">
                <input type="checkbox" name="extras_pagos" value="${extra.name}" data-price="${extra.price}" id="extra_${extra.id}" onchange="updateExtrasCost()">
                <label for="extra_${extra.id}">${extra.name} (+ R$ ${extra.price.toFixed(2).replace('.', ',')})</label>
            </div>
        `;
    });
    html += `</div>`;

    document.getElementById('options-container').innerHTML = html;
    document.getElementById('product-modal').classList.add('active');
}

// Limita as seleções com base no copo escolhido
function checkLimit(checkbox, categoryId, limit) {
    const checkedBoxes = document.querySelectorAll(`input[name="${categoryId}"]:checked`);
    if (checkedBoxes.length > limit) {
        checkbox.checked = false;
        alert(`O ${currentProduct.name} permite apenas ${limit} opção(ões) na categoria ${categoryId.toUpperCase()}.`);
    }
}

// Atualiza valor extra da Nutella e Paçoca
function updateExtrasCost() {
    currentExtrasCost = 0;
    document.querySelectorAll('input[name="extras_pagos"]:checked').forEach(cb => {
        currentExtrasCost += parseFloat(cb.getAttribute('data-price'));
    });
    updateModalPrice();
}

function updateModalPrice() {
    const total = currentProduct.price + currentExtrasCost;
    document.getElementById('modal-price').innerText = total.toFixed(2).replace('.', ',');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Lógica do Carrinho
function addToCart() {
    const selections = {};
    let valid = true;

    // Valida se marcou pelo menos 1 de cada categoria (Opcional, mas recomendado)
    components.forEach(cat => {
        const checked = Array.from(document.querySelectorAll(`input[name="${cat.id}"]:checked`)).map(cb => cb.value);
        selections[cat.name] = checked;
    });

    const extras = Array.from(document.querySelectorAll(`input[name="extras_pagos"]:checked`)).map(cb => {
        return { name: cb.value, price: parseFloat(cb.getAttribute('data-price')) };
    });

    const itemTotal = currentProduct.price + currentExtrasCost;

    cart.push({
        product: currentProduct,
        selections: selections,
        extras: extras,
        total: itemTotal
    });

    closeModal('product-modal');
    updateCartUI();
}

function updateCartUI() {
    const cartBar = document.getElementById('cart-bar');
    if (cart.length > 0) {
        cartBar.classList.remove('hidden');
        document.getElementById('cart-count').innerText = `${cart.length} item(ns)`;
        
        const totalCart = cart.reduce((sum, item) => sum + item.total, 0);
        document.getElementById('bar-total').innerText = totalCart.toFixed(2).replace('.', ',');
        document.getElementById('cart-total-price').innerText = totalCart.toFixed(2).replace('.', ',');
    } else {
        cartBar.classList.add('hidden');
    }
}

function openCart() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';

    cart.forEach((item, index) => {
        let desc = '';
        for (const [cat, options] of Object.entries(item.selections)) {
            if(options.length > 0) desc += `<b>${cat}:</b> ${options.join(', ')}<br>`;
        }
        if(item.extras.length > 0) {
            desc += `<b>Adicionais:</b> ${item.extras.map(e => e.name).join(', ')}<br>`;
        }

        container.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-title">
                    <span>${item.product.name}</span>
                    <span>R$ ${item.total.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="cart-item-desc">${desc}</div>
                <button onclick="removeItem(${index})" style="color: red; border:none; background:none; margin-top:5px; cursor:pointer;">Remover Item</button>
            </div>
        `;
    });

    document.getElementById('cart-modal').classList.add('active');
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
    if(cart.length === 0) closeModal('cart-modal');
    else openCart();
}

// Formulário de Checkout Dinâmico
function toggleAddress() {
    const tipo = document.getElementById('tipo-entrega').value;
    document.getElementById('cliente-endereco').style.display = tipo === 'entrega' ? 'block' : 'none';
    document.getElementById('cliente-endereco').required = tipo === 'entrega';
}

function toggleTroco() {
    const pgto = document.getElementById('forma-pagamento').value;
    document.getElementById('cliente-troco').style.display = pgto === 'dinheiro' ? 'block' : 'none';
}

// Envio para o WhatsApp
function sendWhatsApp() {
    if (cart.length === 0) return alert('Seu carrinho está vazio!');
    
    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const nome = document.getElementById('cliente-nome').value;
    const tipo = document.getElementById('tipo-entrega').value;
    const endereco = document.getElementById('cliente-endereco').value;
    const pag = document.getElementById('forma-pagamento').value;
    const troco = document.getElementById('cliente-troco').value;

    let text = `*NOVO PEDIDO - PLAY AÇAÍ*%0A%0A`;
    text += `*Cliente:* ${nome}%0A`;
    text += `*Tipo:* ${tipo === 'entrega' ? 'Entrega' : 'Retirada'}%0A`;
    if (tipo === 'entrega') text += `*Endereço:* ${endereco}%0A`;
    text += `*Pagamento:* ${pag.toUpperCase()}%0A`;
    if (pag === 'dinheiro' && troco) text += `*Troco para:* R$ ${troco}%0A`;
    text += `%0A*ITENS DO PEDIDO:*%0A`;

    cart.forEach(item => {
        text += `------------------------%0A`;
        text += `*1x ${item.product.name}* - R$ ${item.total.toFixed(2)}%0A`;
        for (const [cat, options] of Object.entries(item.selections)) {
            if(options.length > 0) text += `_${cat}:_ ${options.join(', ')}%0A`;
        }
        if(item.extras.length > 0) {
            text += `_Adicionais Pagos:_ ${item.extras.map(e => e.name).join(', ')}%0A`;
        }
    });

    const totalCart = cart.reduce((sum, item) => sum + item.total, 0);
    text += `------------------------%0A`;
    text += `*TOTAL DA COMPRA: R$ ${totalCart.toFixed(2)}*`;

    // Número do WhatsApp oficial que você passou
    const zapNumber = '5581995437788';
    window.open(`https://wa.me/${zapNumber}?text=${text}`, '_blank');
}
