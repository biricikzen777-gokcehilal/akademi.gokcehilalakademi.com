<template>
    <div class="user-orders">
        <h4 class="fw-bold mb-4  mt-4 text-dark">Sipariş Geçmişim</h4>
        <div class="card border border-light-subtle shadow-sm rounded-3 overflow-hidden">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0" style="font-size: 14px;">
                    <thead class="table-light text-muted">
                        <tr>
                            <th>Sipariş No</th>
                            <th>Tarih</th>
                            <th>Tutar</th>
                            <th>Durum</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="fw-semibold text-success">#ORD-593821</td>
                            <td>25.10.2026</td>
                            <td class="fw-medium">1,200.00₺</td>
                            <td><span class="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1">Onaylandı</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default { name: 'UserOrders' }
</script>
