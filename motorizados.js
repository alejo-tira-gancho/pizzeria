// Usamos nombres únicos para evitar el error de "already declared"
// 1. URL real extraída de tu panel de Supabase
const URL_PIZZERIA_M = 'https://hjwfmexfahcqsiqnsxpd.supabase.co'; 
// 2. Asegúrate de que esta sea la 'anon public' key de tu proyecto
const KEY_PIZZERIA_M = 'sb_publishable_mH6jx0dJyPpbxIGyvWlP4g_5o8NlOmJ'; 

// Inicializamos el cliente con un nombre único para evitar errores de duplicados
const motorizadoSupabase = window.supabase.createClient(URL_PIZZERIA_M, KEY_PIZZERIA_M);

async function cargarPedidosMotorizado() {
    const contenedor = document.getElementById('listaEntregas');
    
    try {
        const { data, error } = await motorizadoSupabase
            .from('pedidos')
            .select('*')
            .eq('estado', 'despachado');

        if (error) throw error;

        if (data.length === 0) {
            contenedor.innerHTML = "<p style='text-align:center;'>No hay pedidos para repartir. 🛵💨</p>";
            return;
        }

        contenedor.innerHTML = "";
        data.forEach(p => {
            contenedor.innerHTML += `
                <div class="card-motorizado" style="border:2px solid #ff914d; padding:15px; margin:10px; border-radius:12px; background:#fff;">
                    <h3 style="margin-top:0;">📍 ${p.direccion}</h3>
                    <p><strong>Cliente:</strong> ${p.nombre}</p>
                    <p><strong>Ref:</strong> ${p.referencia || 'N/A'}</p>
                    <div style="display:flex; gap:10px;">
                    <a href="tel:${p.telefono}" style="background:#25d366; color:white; padding:10px; border-radius:8px; text-decoration:none; flex:1; text-align:center;">📞 Llamar</a>
                   <button class="btn-entregar" onclick="confirmarEntrega(${p.id})">✅ Entregado</button>                
                </div>`;
        });
    } catch (err) {
        console.error("Error al cargar:", err.message);
    }
}

async function confirmarEntrega(id) {
    const { error } = await motorizadoSupabase
        .from('pedidos')
        .update({ estado: 'entregado' })
        .eq('id', id);

    if (!error) {
        alert("¡Pedido entregado! Buen trabajo. 🍕");
        cargarPedidosMotorizado();
    }
}

// Ejecutar al cargar
cargarPedidosMotorizado();