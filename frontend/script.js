const API_URL = "http://127.0.0.1:8000/api/portofolio";

// Elemen DOM Utama
const portfolioContainer = document.getElementById("portfolio-container");
const portfolioForm = document.getElementById("portfolio-form");

// Elemen DOM untuk Navigasi Multi-Halaman SPA
const menuDashboard = document.getElementById("menu-dashboard");
const menuTambah = document.getElementById("menu-tambah");
const menuRiwayat = document.getElementById("menu-riwayat");
const menuTrophy = document.getElementById("menu-trophy");
const menuSettings = document.getElementById("menu-settings");

const pageDashboard = document.getElementById("page-dashboard");
const pageTambah = document.getElementById("page-tambah");
const pageRiwayat = document.getElementById("page-riwayat");
const pageTrophy = document.getElementById("page-trophy");
const pageSettings = document.getElementById("page-settings");

// Elemen DOM untuk Kontainer Khusus Halaman Baru
const accordionRiwayatContainer = document.getElementById("accordion-riwayat-container");
const trophyContainer = document.getElementById("trophy-container");
const mainContentBg = document.getElementById("main-content-bg");
const btnToggleTema = document.getElementById("btn-toggle-tema");

// Elemen DOM untuk Modal Transaksi (Setor / Tarik Saldo) dengan Masking Koma
const modalIsiSaldo = document.getElementById("modal-isi-saldo");
const modalTitle = document.getElementById("modal-title");
const nominalIsiMask = document.getElementById("nominal-isi-mask");
const nominalIsiHidden = document.getElementById("nominal-isi");
const catatanIsiInput = document.getElementById("catatan-isi"); 
const btnCancelIsi = document.getElementById("btn-cancel-isi");
const btnConfirmIsi = document.getElementById("btn-confirm-isi");

// ELEMEN SELEKTOR CASH / E-MONEY
const btnMethodCash = document.getElementById("btn-method-cash");
const btnMethodEmoney = document.getElementById("btn-method-emoney");
const groupVendorEmoney = document.getElementById("group-vendor-emoney");
const vendorEmoneySelect = document.getElementById("vendor-emoney-select");
const metodePembayaranPilihan = document.getElementById("metode-pembayaran-pilihan");

// Elemen DOM untuk Modal Edit Portfolio
const modalEditPortfolio = document.getElementById("modal-edit-portfolio");
const editPortfolioForm = document.getElementById("edit-portfolio-form");
const editNamaInput = document.getElementById("edit-nama");
const editTargetMask = document.getElementById("edit-target-mask");
const editTargetHidden = document.getElementById("edit-target");
const editRincianMask = document.getElementById("edit-rincian-mask");
const editRincianHidden = document.getElementById("edit-rincian");
const editFotoInput = document.getElementById("edit-foto");
const btnCancelEdit = document.getElementById("btn-cancel-edit");

// Elemen Custom Dropdown Periode Modal Edit
const editPeriodeTrigger = document.getElementById("edit-periode-trigger");
const editPeriodeMenu = document.getElementById("edit-periode-menu");
const editPeriodeLabel = document.getElementById("edit-periode-label");
const editPeriodeHidden = document.getElementById("edit-periode");

// Elemen Input Form Tambah
const targetSasaranMask = document.getElementById("target_sasaran_mask");
const targetSasaranHidden = document.getElementById("target_sasaran");
const rincianNominalMask = document.getElementById("rincian_nominal_mask");
const rincianNominalHidden = document.getElementById("rincian_nominal");

// Custom Dropdown Periode Form Buat
const periodeTrigger = document.getElementById("periode-trigger");
const periodeMenu = document.getElementById("periode-menu");
const periodeLabel = document.getElementById("periode-label");
const rincianPeriodeHidden = document.getElementById("rincian_periode");

// PENANDA ELEMEN DIALOG POPUP KUSTOM GLOBAL
const modalKonfirmasiGlobal = document.getElementById("modal-konfirmasi-global");
const konfirmasiTitle = document.getElementById("konfirmasi-title");
const konfirmasiPesan = document.getElementById("konfirmasi-pesan");
const btnKonfirmasiOke = document.getElementById("btn-konfirmasi-oke");
const btnKonfirmasiBatal = document.getElementById("btn-konfirmasi-batal");
let callbackKonfirmasiSistem = null;

let databaseLokal = {}; 
let idKartuTerbukaMaksimal = ""; 
let targetKeyIdAktif = "";
let jenisAksiAktif = "";

// ==========================================
// INJEKSI STYLE DINAMIS: ANIMASI TRANSISI AKORDION ELASTIS ANTI-JEPRET
// ==========================================
const styleInjeksiAnimasi = document.createElement("style");
styleInjeksiAnimasi.innerHTML = `
    .panel-detail-mutasi {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .history-sub-tabs {
        display: flex;
        gap: 12px;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding-bottom: 12px;
    }
    .btn-sub-tab {
        background: rgba(255, 255, 255, 0.05);
        color: #86868b;
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 8px 18px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .btn-sub-tab:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
    }
    .btn-sub-tab.active-sub {
        background: #007aff;
        color: #ffffff;
        border-color: #007aff;
        box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
    }
    .sub-tab-block-view {
        opacity: 0;
        transform: translateY(6px);
        transition: opacity 0.25s cubic-bezier(0.25, 1, 0.5, 1), transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .sub-tab-block-view.fade-active-render {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(styleInjeksiAnimasi);

// ==========================================
// FUNGSIONALITAS: LOGIKA SAKELAR TOMBOL E-MONEY
// ==========================================
if (btnMethodCash && btnMethodEmoney) {
    btnMethodCash.addEventListener("click", () => {
        metodePembayaranPilihan.value = "cash";
        btnMethodCash.className = "btn-action primary";
        btnMethodEmoney.className = "btn-action secondary";
        if (groupVendorEmoney) groupVendorEmoney.style.display = "none";
    });

    btnMethodEmoney.addEventListener("click", () => {
        metodePembayaranPilihan.value = "emoney";
        btnMethodCash.className = "btn-action secondary";
        btnMethodEmoney.className = "btn-action primary";
        if (groupVendorEmoney) groupVendorEmoney.style.display = "block";
    });
}

function formatAngkaDenganKoma(angkaString) {
    let angkaMurni = angkaString.replace(/[^0-9]/g, '');
    if (!angkaMurni) return "";
    return parseInt(angkaMurni).toLocaleString('en-US');
}

if (targetSasaranMask) {
    targetSasaranMask.addEventListener("input", (e) => {
        let posisiKursor = e.target.selectionStart;
        let panjangLama = e.target.value.length;
        let nilaiFormat = formatAngkaDenganKoma(e.target.value);
        e.target.value = nilaiFormat;
        targetSasaranHidden.value = nilaiFormat.replace(/,/g, '');
        let selisihPanjang = e.target.value.length - panjangLama;
        e.target.setSelectionRange(posisiKursor + selisihPanjang, posisiKursor + selisihPanjang);
    });
}

if (rincianNominalMask) {
    rincianNominalMask.addEventListener("input", (e) => {
        let posisiKursor = e.target.selectionStart;
        let panjangLama = e.target.value.length;
        let nilaiFormat = formatAngkaDenganKoma(e.target.value);
        e.target.value = nilaiFormat;
        rincianNominalHidden.value = nilaiFormat.replace(/,/g, '');
        let selisihPanjang = e.target.value.length - panjangLama;
        e.target.setSelectionRange(posisiKursor + selisihPanjang, posisiKursor + selisihPanjang);
    });
}

if (editTargetMask) {
    editTargetMask.addEventListener("input", (e) => {
        let posisiKursor = e.target.selectionStart;
        let panjangLama = e.target.value.length;
        let nilaiFormat = formatAngkaDenganKoma(e.target.value);
        e.target.value = nilaiFormat;
        editTargetHidden.value = nilaiFormat.replace(/,/g, '');
        let selisihPanjang = e.target.value.length - panjangLama;
        e.target.setSelectionRange(posisiKursor + selisihPanjang, posisiKursor + selisihPanjang);
    });
}

if (editRincianMask) {
    editRincianMask.addEventListener("input", (e) => {
        let posisiKursor = e.target.selectionStart;
        let panjangLama = e.target.value.length;
        let nilaiFormat = formatAngkaDenganKoma(e.target.value);
        e.target.value = nilaiFormat;
        editRincianHidden.value = nilaiFormat.replace(/,/g, '');
        let selisihPanjang = e.target.value.length - panjangLama;
        e.target.setSelectionRange(posisiKursor + selisihPanjang, posisiKursor + selisihPanjang);
    });
}

if (nominalIsiMask) {
    nominalIsiMask.addEventListener("input", (e) => {
        let posisiKursor = e.target.selectionStart;
        let panjangLama = e.target.value.length;
        let nilaiFormat = formatAngkaDenganKoma(e.target.value);
        e.target.value = nilaiFormat;
        nominalIsiHidden.value = nilaiFormat.replace(/,/g, '');
        let selisihPanjang = e.target.value.length - panjangLama;
        e.target.setSelectionRange(posisiKursor + selisihPanjang, posisiKursor + selisihPanjang);
    });
}

function tampilkanDialogKonfirmasiKustom(judul, pesan, callback) {
    if (!modalKonfirmasiGlobal) return;
    konfirmasiTitle.textContent = judul;
    konfirmasiPesan.textContent = pesan;
    callbackKonfirmasiSistem = callback;
    modalKonfirmasiGlobal.classList.add("show");
}

if (btnKonfirmasiBatal) {
    btnKonfirmasiBatal.addEventListener("click", () => {
        modalKonfirmasiGlobal.classList.remove("show");
        callbackKonfirmasiSistem = null;
    });
}

if (btnKonfirmasiOke) {
    btnKonfirmasiOke.addEventListener("click", () => {
        modalKonfirmasiGlobal.classList.remove("show");
        if (callbackKonfirmasiSistem) callbackKonfirmasiSistem();
        callbackKonfirmasiSistem = null;
    });
}

// ==========================================
// 1. FUNGSI UTAMA: MUAT PORTOFOLIO GRAPH & AGREGASI DATA
// ==========================================
async function muatPortofolio() {
    try {
        const response = await fetch(API_URL);
        const dataAwal = await response.json();
        
        const statGlobal = dataAwal.stat_global || {};
        databaseLokal = dataAwal.daftar_tabungan || {};
        
        document.getElementById("global-target").textContent = `Rp ${(statGlobal.total_target_global || 0).toLocaleString()}`;
        document.getElementById("global-sisa-target").textContent = `↑ Rp ${(statGlobal.sisa_target_global || 0).toLocaleString()} Sisa`;
        document.getElementById("global-persentase").textContent = `${statGlobal.persentase_global || 0}%`;
        document.getElementById("global-sisa-persen").textContent = `↓ ${statGlobal.sisa_persentase_global || 100}% Sisa Target`;

        let totalCashGlobal = 0;
        let totalEmoneyGlobal = 0;
        let emoneyVendorBalances = {}; 

        portfolioContainer.innerHTML = "";
        trophyContainer.innerHTML = ""; 
        
        const keys = Object.keys(databaseLokal);
        
        keys.forEach(key => {
            const item = databaseLokal[key];
            const riwayat = item.riwayat || [];
            
            riwayat.forEach(trx => {
                const nominal = parseInt(trx.nominal) || 0;
                const isMasuk = trx.jenis === "masuk";
                
                let parsedMetode = "cash";
                let parsedVendor = "";
                const catatanMentah = trx.catatan || "";

                if (catatanMentah.includes("<EMN:")) {
                    parsedMetode = "emoney";
                    const match = catatanMentah.match(/<EMN:(.*?)>/);
                    if (match) parsedVendor = match[1];
                } else if (catatanMentah.includes("<CSH>")) {
                    parsedMetode = "cash";
                }
                
                if (parsedMetode === "emoney") {
                    if (isMasuk) totalEmoneyGlobal += nominal; else totalEmoneyGlobal -= nominal;
                    
                    const vendorName = parsedVendor || "Digital Lainnya";
                    if (!emoneyVendorBalances[vendorName]) emoneyVendorBalances[vendorName] = 0;
                    
                    if (isMasuk) {
                        emoneyVendorBalances[vendorName] += nominal;
                    } else {
                        emoneyVendorBalances[vendorName] -= nominal;
                    }
                } else {
                    if (isMasuk) totalCashGlobal += nominal; else totalCashGlobal -= nominal;
                }
            });
        });

        const totalKeseluruhanGlobal = totalCashGlobal + totalEmoneyGlobal;

        document.getElementById("sub-total-keseluruhan").textContent = `Rp ${totalKeseluruhanGlobal.toLocaleString()}`;
        document.getElementById("sub-total-cash").textContent = `Rp ${totalCashGlobal.toLocaleString()}`;
        document.getElementById("sub-total-emoney").textContent = `Rp ${totalEmoneyGlobal.toLocaleString()}`;
        
        const dynamicListEl = document.getElementById("dynamic-emoney-list");
        dynamicListEl.innerHTML = ""; 
        
        let hasActiveEmoney = false;
        for (const [vendor, balance] of Object.entries(emoneyVendorBalances)) {
            if (balance > 0) { 
                hasActiveEmoney = true;
                const itemDiv = document.createElement("div");
                itemDiv.className = "stat-sub-item";
                itemDiv.innerHTML = `<span>• ${vendor}:</span><span>Rp ${balance.toLocaleString()}</span>`;
                dynamicListEl.appendChild(itemDiv);
            }
        }

        if (!hasActiveEmoney) {
            dynamicListEl.innerHTML = `<span style="color: #636366; font-style: italic;">Belum ada saldo</span>`;
        }
        
        if (keys.length === 0) {
            portfolioContainer.innerHTML = `<p class="empty-state">Belum ada portofolio tabungan yang dibuat. Yuk buat di menu sebelah kiri! 🚀</p>`;
            trophyContainer.innerHTML = `<p class="empty-state">Belum ada piala tersimpan. Selesaikan tabunganmu hingga 100%! 🏆</p>`;
            
            const elFill = document.getElementById("achieve-fill");
            const elText = document.getElementById("achieve-text");
            if (elFill && elText) {
                elFill.style.width = "0%";
                elText.textContent = "0% Goals Completed";
            }
            return;
        }
        
        let jumlahAktif = 0;
        let jumlahLulus = 0;

        keys.forEach(key => {
            const item = databaseLokal[key];
            const terkumpul = item.terkumpul || 0;
            const target = item.target_sasaran || 0;
            const sisaTarget = item.sisa_target || 0;
            const persentase = item.persentase || 0;
            const riwayat = item.riwayat || [];
            
            let alokasiNominal = item.rincian_nominal || 20000;
            let nilaiEstimasi = item.estimasi_hari_lagi || 0;
            let teksPeriodeLabel = item.periode_label || "hari";
            let teksRincian = `Rp ${alokasiNominal.toLocaleString()} / ${teksPeriodeLabel}`;

            let kartuCash = 0;
            let kartuEmoney = 0;
            
            // FIX BUG DI SINI: Menerapkan Metadata Extraction yang sama untuk Kartu Dashboard
            riwayat.forEach(t => {
                const nom = parseInt(t.nominal) || 0;
                const masuk = t.jenis === "masuk";
                
                let pMetode = "cash";
                const cMentah = t.catatan || "";

                if (cMentah.includes("<EMN:")) {
                    pMetode = "emoney";
                } else if (cMentah.includes("<CSH>")) {
                    pMetode = "cash";
                }

                if (pMetode === "emoney") {
                    if (masuk) kartuEmoney += nom; else kartuEmoney -= nom;
                } else {
                    if (masuk) kartuCash += nom; else kartuCash -= nom;
                }
            });

            let terakhirColorClass = "highlight-green"; 
            const stringTerakhir = item.terakhir_diisi ? item.terakhir_diisi.trim() : "";

            if (!stringTerakhir || stringTerakhir.includes("Belum") || stringTerakhir === "-") {
                terakhirColorClass = "highlight-red"; 
            } else {
                const formatIsoDate = stringTerakhir.replace(" ", "T");
                const tanggalObyekTrx = new Date(formatIsoDate);
                if (!isNaN(tanggalObyekTrx.getTime())) {
                    const selisihMilidetik = new Date() - tanggalObyekTrx;
                    const selisihHariSistem = selisihMilidetik / (1000 * 60 * 60 * 24);
                    if (selisihHariSistem > 3) terakhirColorClass = "highlight-red"; 
                } else {
                    terakhirColorClass = "highlight-red";
                }
            }

            const card = document.createElement("div");
            card.className = "portfolio-card";
            
            if (persentase < 100) {
                jumlahAktif++;
                card.setAttribute("onclick", `bukaHalamanRiwayatSpesifik('${key}')`);
                card.innerHTML = `
                    <div class="portfolio-left">
                        <img src="http://127.0.0.1:8000${item.foto}" class="portfolio-img" alt="${item.nama}">
                        <div class="portfolio-info">
                            <h2>${item.nama.toUpperCase()}</h2>
                            <div class="portfolio-meta">Dibuat pada: ${item.dibuat_pada}</div>
                            <div class="portfolio-details">
                                <div class="detail-item"><span class="icon">🕒</span> Terakhir: <span class="${terakhirColorClass}">${item.terakhir_diisi}</span></div>
                                <div class="detail-item"><span class="icon">🎯</span> Alokasi: <span class="highlight-green">${teksRincian}</span></div>
                                <div class="detail-item"><span class="icon">⏳</span> Estimasi: <span class="highlight-blue">${nilaiEstimasi} ${teksPeriodeLabel.toUpperCase()} LAGI</span></div>
                                <div class="detail-item" style="margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4px; font-size: 11px; display:flex; gap:10px;">
                                    <span>💵 Cash: <strong class="txt-adaptive-white">Rp ${kartuCash.toLocaleString()}</strong></span>
                                    <span>📱 E-Money: <strong style="color:#64d2ff">Rp ${kartuEmoney.toLocaleString()}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="portfolio-center">
                        <div class="data-group terkumpul"><h4>Terkumpul</h4><p class="txt-terkumpul-value">Rp ${terkumpul.toLocaleString()}</p></div>
                        <div class="data-group"><h4>Sisa Target</h4><p>Rp ${sisaTarget.toLocaleString()}</p></div>
                        <div class="data-group"><h4>Target Tabungan</h4><p>Rp ${target.toLocaleString()}</p></div>
                    </div>
                    <div class="portfolio-right" onclick="event.stopPropagation()">
                        <div class="progress-container">
                            <svg class="progress-ring" width="64" height="64"><circle class="progress-ring__circle" stroke="#30d158" stroke-width="5" fill="transparent" r="25" cx="32" cy="32" style="stroke-dashoffset: ${157 - (persentase / 100 * 157)};"/></svg>
                            <div class="progress-text">${persentase}%</div>
                        </div>
                        <div class="card-actions">
                            <button class="btn-action primary" onclick="bukaModalTransaksi('${key}', '${item.nama}', 'masuk')">Isi Tabungan</button>
                            <button class="btn-action warning" onclick="bukaModalTransaksi('${key}', '${item.nama}', 'keluar')">Tarik Saldo</button>
                            <div style="display: flex; gap: 6px;">
                                <button class="btn-action primary" style="background-color: #5856d6; flex: 1;" onclick="bukaModalEdit('${key}')">✏️ Edit</button>
                                <button class="btn-action danger" style="padding: 8px 10px;" onclick="hapusPortfolio('${key}')">🗑️</button>
                            </div>
                        </div>
                    </div>
                `;
                portfolioContainer.appendChild(card);
            } else {
                jumlahLulus++;
                card.innerHTML = `
                    <div class="portfolio-left">
                        <img src="http://127.0.0.1:8000${item.foto}" class="portfolio-img" alt="${item.nama}" style="border: 2px solid #ffd700;">
                        <div class="portfolio-info">
                            <h2>🏆 ${item.nama.toUpperCase()} (TERCAPAI)</h2>
                            <div class="portfolio-meta" style="color: #ffd700; font-weight: 600;">STATUS: TARGET TERCAPAI 100% 👑</div>
                        </div>
                    </div>
                    <div class="portfolio-center">
                        <div class="data-group terkumpul"><h4>Total Terkumpul</h4><p style="color: #30d158;">Rp ${terkumpul.toLocaleString()}</p></div>
                        <div class="data-group"><h4>Target Tabungan</h4><p>Rp ${target.toLocaleString()}</p></div>
                    </div>
                    <div class="portfolio-right" style="padding-right: 20px;" onclick="event.stopPropagation()">
                        <div style="text-align: center; color: #ffd700; font-size: 20px; font-weight: bold; margin-bottom: 12px; margin-right: 20px;">ACHIEVED</div>
                        <div class="card-actions" style="margin-right: 10px;">
                            <button class="btn-action warning" onclick="bukaModalTransaksi('${key}', '${item.nama}', 'keluar')" style="width:100%">Tarik Dana Alokasi</button>
                            <button class="btn-action danger" style="width: 100%; margin-top: 4px;" onclick="hapusPortfolio('${key}')">🗑️ Hapus Arsip</button>
                        </div>
                    </div>
                `;
                trophyContainer.appendChild(card);
            }
        });

        if (jumlahAktif === 0) portfolioContainer.innerHTML = `<p class="empty-state">Semua tabungan sudah selesai and pindah ke Trophy Room! 🏆🎉</p>`;
        if (jumlahLulus === 0) trophyContainer.innerHTML = `<p class="empty-state">Belum ada piala tersimpan. Selesaikan tabunganmu hingga 100%! 🏆</p>`;

        const totalSemua = keys.length;
        const totalSelesai = jumlahLulus;
        const persentaseAchieved = totalSemua > 0 ? Math.round((totalSelesai / totalSemua) * 100) : 0;
        
        const elFill = document.getElementById("achieve-fill");
        const elText = document.getElementById("achieve-text");
        
        if (elFill && elText) {
            elFill.style.width = `${persentaseAchieved}%`;
            elText.textContent = `${persentaseAchieved}% Goals Completed`;
        }
    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }
}

// ==========================================
// 2. LOGIKA UTAMA: RENDER ACCORDION HISTORY SAKELAR SUB-TAB ANTI JEPURET
// ==========================================
function renderAccordionRiwayat() {
    accordionRiwayatContainer.innerHTML = "";
    const keys = Object.keys(databaseLokal);

    if (keys.length === 0) {
        accordionRiwayatContainer.innerHTML = `<p class="empty-state">Belum ada portofolio tabungan yang terdaftar.</p>`; 
        return;
    }

    keys.forEach(key => {
        const item = databaseLokal[key];
        const riwayat = item.riwayat || [];
        const isTerbuka = key === idKartuTerbukaMaksimal;

        const target = item.target_sasaran || 0;
        const terkumpul = item.terkumpul || 0;
        const sisaTarget = item.sisa_target || 0;

        let historyCash = 0;
        let historyEmoney = 0;
        let historyVendorBalances = {};

        riwayat.forEach(t => {
            const nom = parseInt(t.nominal) || 0;
            const masuk = t.jenis === "masuk";

            let pMetode = "cash";
            let pVendor = "";
            const cMentah = t.catatan || "";

            if (cMentah.includes("<EMN:")) {
                pMetode = "emoney";
                const match = cMentah.match(/<EMN:(.*?)>/);
                if (match) pVendor = match[1];
            } else if (cMentah.includes("<CSH>")) {
                pMetode = "cash";
            }

            if (pMetode === "emoney") {
                if (masuk) historyEmoney += nom; else historyEmoney -= nom;
                const vName = pVendor || "Digital";
                if (!historyVendorBalances[vName]) historyVendorBalances[vName] = 0;
                if (masuk) historyVendorBalances[vName] += nom; else historyVendorBalances[vName] -= nom;
            } else {
                if (masuk) historyCash += nom; else historyCash -= nom;
            }
        });

        let vendorPecahanListHTML = "";
        let hasEmoney = false;
        for (const [vendor, balance] of Object.entries(historyVendorBalances)) {
            if (balance > 0) {
                hasEmoney = true;
                vendorPecahanListHTML += `<span style="background: rgba(100, 210, 255, 0.1); color: #64d2ff; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500;">• ${vendor}: Rp ${balance.toLocaleString()}</span>`;
            }
        }
        if (!hasEmoney) {
            vendorPecahanListHTML = `<span style="color: #636366; font-style: italic; font-size: 12px;">Tidak ada saldo dompet digital aktif</span>`;
        }

        const accordionWrapper = document.createElement("div");
        accordionWrapper.style.display = "flex";
        accordionWrapper.style.flexDirection = "column";

        const headerCard = document.createElement("div");
        headerCard.className = "portfolio-card";
        if (isTerbuka) headerCard.classList.add("aktif-buka");

        headerCard.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px; width: 40%;">
                <span class="panah-arrow" style="font-size: 14px; transform: ${isTerbuka ? 'rotate(90deg)' : 'rotate(0deg)'}; transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1); color: #86868b; display: inline-block;">▶</span>
                <img src="http://127.0.0.1:8000${item.foto}" style="width: 54px; height: 50px; border-radius: 10px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);">
                <div>
                    <h4 class="txt-adaptive-white" style="font-size: 16px; font-weight: 600; margin-bottom: 2px;">${item.nama.toUpperCase()} <span style="font-size: 12px; color: #86868b; font-weight: 400; margin-left: 6px;">(${riwayat.length} Trx)</span></h4>
                    <span style="font-size: 12px; color: #636366;">Dibuat: ${item.dibuat_pada}</span>
                </div>
            </div>
            
            <div style="display: flex; gap: 40px; align-items: center; flex-grow: 1; justify-content: flex-end; padding-right: 10px;">
                <div style="text-align: right; min-width: 100px;">
                    <span style="font-size: 11px; color: #86868b; display: block; margin-bottom: 2px;">TERKUMPUL</span>
                    <strong style="color: #30d158; font-size: 15px;">Rp ${terkumpul.toLocaleString()}</strong>
                </div>
                <div style="text-align: right; min-width: 100px;">
                    <span style="font-size: 11px; color: #ff9500; display: block; margin-bottom: 2px;">SISA TARGET</span>
                    <strong style="color: #ff9500; font-size: 15px;">Rp ${sisaTarget.toLocaleString()}</strong>
                </div>
                <div style="text-align: right; min-width: 100px;">
                    <span style="font-size: 11px; color: #86868b; display: block; margin-bottom: 2px;">TARGET TABUNGAN</span>
                    <strong class="txt-adaptive-white" style="font-size: 15px;">Rp ${target.toLocaleString()}</strong>
                </div>
                <div style="text-align: right; min-width: 60px;">
                    <span style="font-size: 11px; color: #86868b; display: block; margin-bottom: 2px;">PROG.</span>
                    <strong style="color: #30d158; font-size: 15px;">${item.persentase}%</strong>
                </div>
            </div>
        `;

        const panelDetail = document.createElement("div");
        panelDetail.className = "panel-detail-mutasi";

        const innerWrapper = document.createElement("div");
        innerWrapper.className = "panel-inner";

        const subTabsContainer = document.createElement("div");
        subTabsContainer.className = "history-sub-tabs";
        subTabsContainer.innerHTML = `
            <button class="btn-sub-tab active-sub" id="tab-trx-${key}">📄 Detail Transaksi</button>
            <button class="btn-sub-tab" id="tab-goal-${key}">📊 Detail Tabungan</button>
        `;
        innerWrapper.appendChild(subTabsContainer);

        const infoTabunganBlock = document.createElement("div");
        infoTabunganBlock.id = `block-goal-${key}`;
        infoTabunganBlock.className = "sub-tab-block-view"; 
        infoTabunganBlock.style.cssText = "background: rgba(28, 28, 30, 0.6); border: 1px solid rgba(255,255,255,0.08); padding: 20px; border-radius: 12px; margin-bottom: 10px; display: none; flex-direction: column; gap: 14px;";
        infoTabunganBlock.innerHTML = `
            <div style="display: flex; gap: 50px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px;">
                <div><span style="font-size: 11px; color:#86868b; display:block; margin-bottom:4px; font-weight:600;">💵 TOTAL CASH FISIK</span><strong class="txt-adaptive-white" style="font-size:16px;">Rp ${historyCash.toLocaleString()}</strong></div>
                <div><span style="font-size: 11px; color:#86868b; display:block; margin-bottom:4px; font-weight:600;">📱 TOTAL SALDO E-MONEY</span><strong style="font-size:16px; color:#64d2ff;">Rp ${historyEmoney.toLocaleString()}</strong></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
                <span style="font-size: 11px; color:#86868b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Pecahan Saldo Dompet Digital:</span>
                <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px;">
                    ${vendorPecahanListHTML}
                </div>
            </div>
        `;
        innerWrapper.appendChild(infoTabunganBlock);

        const listTransaksiBlock = document.createElement("div");
        listTransaksiBlock.id = `block-trx-${key}`;
        listTransaksiBlock.className = "sub-tab-block-view fade-active-render"; 

        if (riwayat.length === 0) {
            const emptyEl = document.createElement("p");
            emptyEl.className = "empty-state";
            emptyEl.style.padding = "20px 0";
            emptyEl.textContent = "Belum ada riwayat aktivitas transaksi.";
            listTransaksiBlock.appendChild(emptyEl);
        } else {
            [...riwayat].reverse().forEach(trx => {
                const isMasuk = trx.jenis === "masuk";
                const itemHtml = document.createElement("div");
                itemHtml.className = "history-item";
                itemHtml.style.background = "rgba(44, 44, 46, 0.35)";
                itemHtml.style.padding = "16px 20px";
                itemHtml.style.marginBottom = "10px";
                itemHtml.style.borderRadius = "12px";

                const nominalTrxMurni = parseInt(trx.nominal) || 0;

                let parsedMetode = "cash";
                let parsedVendor = "";
                let displayCatatan = trx.catatan || "Umum";

                if (displayCatatan.includes("<EMN:")) {
                    parsedMetode = "emoney";
                    const match = displayCatatan.match(/<EMN:(.*?)>/);
                    if (match) parsedVendor = match[1];
                    displayCatatan = displayCatatan.replace(/<EMN:.*?>/, "").trim();
                } else if (displayCatatan.includes("<CSH>")) {
                    parsedMetode = "cash";
                    displayCatatan = displayCatatan.replace(/<CSH>/, "").trim();
                }

                let labelMetodeVisual = "💵 Cash / Fisik";
                if (parsedMetode === "emoney") {
                    let iconVendor = "📱";
                    if (parsedVendor === "PayPal" || parsedVendor === "SeaBank" || parsedVendor === "Bank Jago") iconVendor = "💳";
                    labelMetodeVisual = `${iconVendor} E-Money (${parsedVendor || 'Digital'})`;
                }

                itemHtml.innerHTML = `
                    <div class="history-info">
                        <h5 class="txt-adaptive-white" style="font-size: 15px; font-weight: 600;">${isMasuk ? "Setoran Kas Masuk" : "Penarikan Dana Keluar"}</h5>
                        <div style="display: flex; gap: 20px; margin-top: 4px; color: #86868b; font-size: 12px;">
                            <span>📝 Kategori: <strong class="txt-adaptive-white">${displayCatatan || "Umum"}</strong></span>
                            <span>💳 Metode: <strong style="color: #64d2ff;">${labelMetodeVisual}</strong></span>
                            <span>🕒 Waktu: ${trx.tanggal}</span>
                        </div>
                    </div>
                    <div class="history-amount" style="gap: 16px;">
                        <span class="history-badge ${isMasuk ? 'badge-masuk' : 'badge-keluar'}">${trx.jenis.toUpperCase()}</span>
                        <strong style="color: ${isMasuk ? '#30d158' : '#ff453a'}; font-size: 16px;">${isMasuk ? "+" : "-"} Rp ${nominalTrxMurni.toLocaleString()}</strong>
                    </div>
                `;
                listTransaksiBlock.appendChild(itemHtml);
            });
        }
        innerWrapper.appendChild(listTransaksiBlock);
        panelDetail.appendChild(innerWrapper);

        setTimeout(() => {
            const btnTrx = document.getElementById(`tab-trx-${key}`);
            const btnGoal = document.getElementById(`tab-goal-${key}`);
            const bTrx = document.getElementById(`block-trx-${key}`);
            const bGoal = document.getElementById(`block-goal-${key}`);

            if (btnTrx && btnGoal) {
                btnTrx.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (btnTrx.classList.contains("active-sub")) return;

                    btnTrx.classList.add("active-sub");
                    btnGoal.classList.remove("active-sub");

                    const currentHeight = innerWrapper.offsetHeight;
                    panelDetail.style.maxHeight = currentHeight + "px";

                    bGoal.classList.remove("fade-active-render");
                    
                    setTimeout(() => {
                        bGoal.style.display = "none";
                        bTrx.style.display = "block";
                        
                        const targetHeight = innerWrapper.offsetHeight;

                        void panelDetail.offsetHeight;

                        panelDetail.style.maxHeight = targetHeight + "px";
                        
                        bTrx.classList.add("fade-active-render");

                        setTimeout(() => {
                            if (panelDetail.classList.contains("buka")) {
                                panelDetail.style.maxHeight = "none";
                            }
                        }, 400);

                    }, 150); 
                });

                btnGoal.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (btnGoal.classList.contains("active-sub")) return;

                    btnGoal.classList.add("active-sub");
                    btnTrx.classList.remove("active-sub");

                    const currentHeight = innerWrapper.offsetHeight;
                    panelDetail.style.maxHeight = currentHeight + "px";

                    bTrx.classList.remove("fade-active-render");
                    
                    setTimeout(() => {
                        bTrx.style.display = "none";
                        bGoal.style.display = "flex"; 
                        
                        const targetHeight = innerWrapper.offsetHeight;

                        void panelDetail.offsetHeight;

                        panelDetail.style.maxHeight = targetHeight + "px";
                        
                        bGoal.classList.add("fade-active-render");

                        setTimeout(() => {
                            if (panelDetail.classList.contains("buka")) {
                                panelDetail.style.maxHeight = "none";
                            }
                        }, 400);

                    }, 150);
                });
            }
        }, 100);

        headerCard.addEventListener("click", () => {
            const panah = headerCard.querySelector(".panah-arrow");
            
            if (panelDetail.classList.contains("buka")) {
                panelDetail.style.maxHeight = innerWrapper.offsetHeight + "px";
                void panelDetail.offsetHeight; 
                panelDetail.style.maxHeight = "0px";
                panelDetail.classList.remove("buka");
                headerCard.classList.remove("aktif-buka");
                if (panah) panah.style.transform = "rotate(0deg)";
                idKartuTerbukaMaksimal = "";
            } else {
                document.querySelectorAll(".panel-detail-mutasi").forEach(p => {
                    p.style.maxHeight = "0px";
                    p.classList.remove("buka");
                });
                document.querySelectorAll("#accordion-riwayat-container .portfolio-card").forEach(c => c.classList.remove("aktif-buka"));
                document.querySelectorAll(".panah-arrow").forEach(arrow => arrow.style.transform = "rotate(0deg)");

                panelDetail.classList.add("buka");
                
                const btnTrx = document.getElementById(`tab-trx-${key}`);
                const btnGoal = document.getElementById(`tab-goal-${key}`);
                const bTrx = document.getElementById(`block-trx-${key}`);
                const bGoal = document.getElementById(`block-goal-${key}`);
                if(btnTrx) {
                    btnTrx.classList.add("active-sub");
                    btnGoal.classList.remove("active-sub");
                    bTrx.style.display = "block";
                    bGoal.style.display = "none";
                    bTrx.classList.add("fade-active-render");
                    bGoal.classList.remove("fade-active-render");
                }

                const targetHeight = innerWrapper.offsetHeight;
                panelDetail.style.maxHeight = targetHeight + "px";
                
                headerCard.classList.add("aktif-buka");
                if (panah) panah.style.transform = "rotate(90deg)";
                idKartuTerbukaMaksimal = key;
                
                setTimeout(() => { if(panelDetail.classList.contains("buka")) panelDetail.style.maxHeight = "none"; }, 400);
            }
        });

        if (isTerbuka) {
            panelDetail.classList.add("buka");
            panelDetail.style.maxHeight = "none";
        }

        accordionWrapper.appendChild(headerCard);
        accordionWrapper.appendChild(panelDetail);
        accordionRiwayatContainer.appendChild(accordionWrapper);
    });
}

function bukaHalamanRiwayatSpesifik(keyId) {
    idKartuTerbukaMaksimal = keyId; 
    menuRiwayat.click(); 
}

// ==========================================
// 3. LOGIKA TRANSAKSI MUTASI (SETOR / TARIK) DENGAN METADATA
// ==========================================
function bukaModalTransaksi(keyId, namaTabungan, jenis) {
    targetKeyIdAktif = keyId;
    jenisAksiAktif = jenis;
    catatanIsiInput.value = ""; 
    
    if (btnMethodCash) btnMethodCash.click();

    if (jenis === "masuk") {
        modalTitle.textContent = `ISI SALDO: ${namaTabungan.toUpperCase()}`;
        btnConfirmIsi.textContent = "Simpan Setoran";
        btnConfirmIsi.className = "btn-submit";
    } else {
        modalTitle.textContent = `TARIK DARI: ${namaTabungan.toUpperCase()}`;
        btnConfirmIsi.textContent = "Tarik Dana";
        btnConfirmIsi.className = "btn-submit btn-action warning";
    }
    
    nominalIsiMask.value = "";
    nominalIsiHidden.value = "";
    modalIsiSaldo.classList.add("show");
}

btnCancelIsi.addEventListener("click", () => { modalIsiSaldo.classList.remove("show"); });

btnConfirmIsi.addEventListener("click", async () => {
    const nominal = parseInt(nominalIsiHidden.value);
    const catatanMentah = catatanIsiInput.value || "Umum";
    const metode = metodePembayaranPilihan.value;
    const vendor = vendorEmoneySelect.value;
    
    if (!nominal || nominal <= 0) {
        alert("Masukkan nominal transaksi yang valid."); 
        return;
    }

    let catatanInjeksi = catatanMentah;
    if (metode === "emoney") {
        catatanInjeksi = `${catatanMentah} <EMN:${vendor}>`;
    } else {
        catatanInjeksi = `${catatanMentah} <CSH>`;
    }

    try {
        const response = await fetch(`${API_URL}/${targetKeyIdAktif}/mutasi`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                nominal: nominal, 
                jenis: jenisAksiAktif, 
                catatan: catatanInjeksi
            })
        });

        if (response.ok) {
            modalIsiSaldo.classList.remove("show");
            await muatPortofolio(); 
            
            if (pageRiwayat.classList.contains("active-page")) {
                renderAccordionRiwayat();
            }

            const tabunganUpdate = databaseLokal[targetKeyIdAktif];
            if (tabunganUpdate && tabunganUpdate.persentase >= 100 && jenisAksiAktif === "masuk") {
                setTimeout(() => {
                    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                }, 300); 
            }
        } else {
            const err = await response.json();
            alert(err.detail); 
        }
    } catch (error) { console.error(error); }
});

// ==========================================
// 4. LOGIKA MODAL EDIT DETAIL PORTFOLIO
// ==========================================
function bukaModalEdit(keyId) {
    const item = databaseLokal[keyId];
    if (!item) return;

    targetKeyIdAktif = keyId;
    editNamaInput.value = item.nama;
    
    editTargetHidden.value = item.target_sasaran;
    editTargetMask.value = parseInt(item.target_sasaran).toLocaleString('en-US');
    
    editRincianHidden.value = item.rincian_nominal;
    editRincianMask.value = parseInt(item.rincian_nominal).toLocaleString('en-US');
    
    const labelPeriodePeta = { "hari": "/ Hari", "minggu": "/ Minggu", "bulan": "/ Bulan", "tahun": "/ Tahun" };
    const labelMentah = item.periode_label || "hari";
    editPeriodeHidden.value = labelMentah;
    editPeriodeLabel.textContent = labelPeriodePeta[labelMentah] || "/ Hari";

    const itemsPeriodeEdit = editPeriodeMenu.querySelectorAll(".dropdown-item");
    itemsPeriodeEdit.forEach(i => {
        i.classList.remove("active");
        if (i.getAttribute("data-value") === labelMentah) i.classList.add("active");
    });
    
    editFotoInput.value = ""; 
    modalEditPortfolio.classList.add("show");
}

btnCancelEdit.addEventListener("click", () => { modalEditPortfolio.classList.remove("show"); });

editPortfolioForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const nama = editNamaInput.value;
    const targetSasaran = editTargetHidden.value;
    const rincianNominal = editRincianHidden.value;
    const periodeLabel = editPeriodeHidden.value;

    if (!targetSasaran || !rincianNominal) {
        alert("Harap lengkapi semua nominal target dan alokasi."); 
        return;
    }

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("target_sasaran", targetSasaran);
    formData.append("rincian_nominal", rincianNominal);
    formData.append("periode_label", periodeLabel); 
    if (editFotoInput.files[0]) {
        formData.append("file_foto", editFotoInput.files[0]);
    }

    try {
        const response = await fetch(`${API_URL}/${targetKeyIdAktif}/edit`, {
            method: "POST",
            body: formData
        });
        if (response.ok) {
            modalEditPortfolio.classList.remove("show");
            await muatPortofolio();
        }
    } catch (error) { console.error(error); }
});

if (editPeriodeTrigger && editPeriodeMenu) {
    editPeriodeTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        editPeriodeMenu.classList.toggle("show");
        editPeriodeTrigger.classList.toggle("open");
    });

    const itemsPeriodeEdit = editPeriodeMenu.querySelectorAll(".dropdown-item");
    itemsPeriodeEdit.forEach(item => {
        item.addEventListener("click", () => {
            const val = item.getAttribute("data-value");
            editPeriodeHidden.value = val;
            editPeriodeLabel.textContent = item.textContent;
            itemsPeriodeEdit.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            editPeriodeMenu.classList.remove("show");
            editPeriodeTrigger.classList.remove("open");
        });
    });
}

// ==========================================
// 5. FUNGSI SUBMIT TAMBAH TABUNGAN
// ==========================================
portfolioForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nama = document.getElementById("nama").value;
    const targetSasaran = targetSasaranHidden.value;
    const rincianNominal = rincianNominalHidden.value;
    const fileInput = document.getElementById("file_foto");
    const rincianPeriode = rincianPeriodeHidden.value;

    if (!targetSasaran || !rincianNominal) {
        alert("Harap isi nominal target sasaran dan alokasi nominal dengan benar."); 
        return;
    }

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("target_sasaran", targetSasaran);
    formData.append("rincian_nominal", rincianNominal);
    formData.append("periode_label", rincianPeriode); 
    if (fileInput.files[0]) {
        formData.append("file_foto", fileInput.files[0]);
    }

    try {
        const response = await fetch(API_URL + "/tambah", { method: "POST", body: formData });
        if (response.ok) {
            portfolioForm.reset();
            targetSasaranHidden.value = "";
            rincianNominalHidden.value = "";
            targetSasaranMask.value = "";
            rincianNominalMask.value = "";
            periodeLabel.textContent = "/ Hari";
            rincianPeriodeHidden.value = "hari";
            menuDashboard.click();
        }
    } catch (error) { console.error(error); }
});

// ==========================================
// 6. FUNGSI HAPUS PORTFOLIO
// ==========================================
async function hapusPortfolio(keyId) {
    tampilkanDialogKonfirmasiKustom(
        "Konfirmasi Penghapusan",
        "Apakah Anda yakin ingin menghapus portofolio tabungan ini secara permanen?",
        async () => {
            try {
                const response = await fetch(`${API_URL}/${keyId}`, { method: "DELETE" });
                if (response.ok) await muatPortofolio();
            } catch (error) { console.error(error); }
        }
    );
}

if (periodeTrigger && periodeMenu) {
    periodeTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        periodeMenu.classList.toggle("show");
        periodeTrigger.classList.toggle("open");
    });

    const itemsPeriode = periodeMenu.querySelectorAll(".dropdown-item");
    itemsPeriode.forEach(item => {
        item.addEventListener("click", () => {
            const val = item.getAttribute("data-value");
            rincianPeriodeHidden.value = val;
            periodeLabel.textContent = item.textContent;
            itemsPeriode.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            periodeMenu.classList.remove("show");
            periodeTrigger.classList.remove("open");
        });
    });
}

document.addEventListener("click", () => {
    if (periodeMenu) { periodeMenu.classList.remove("show"); periodeTrigger.classList.remove("open"); }
    if (editPeriodeMenu) { editPeriodeMenu.classList.remove("show"); editPeriodeTrigger.classList.remove("open"); }
});

// ==========================================
// 8. LOGIKA SETTINGS: LIGHT MODE & BACKGROUNDS
// ==========================================
let isDarkMode = true;
let gambarSkripLokal = "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), url('bg-dollar.jpg')";

if (btnToggleTema) {
    btnToggleTema.addEventListener("click", () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle("light-theme", !isDarkMode);
        
        const tombolPolosKustom = document.getElementById("btn-bg-minimalist");
        if (tombolPolosKustom) {
            if (isDarkMode) {
                tombolPolosKustom.innerHTML = "⚫ Dark Minimalist (Polos)";
                tombolPolosKustom.setAttribute("data-bg", "linear-gradient(135deg, #1c1c1e 0%, #000000 100%)");
            } else {
                tombolPolosKustom.innerHTML = "⚪ Light Minimalist (Polos)";
                tombolPolosKustom.setAttribute("data-bg", "linear-gradient(135deg, #f2f2f7 0%, #e5e5ea 100%)");
            }
        }

        perbaruiEfekLatarBelakang(gambarSkripLokal);
        
        if (isDarkMode) {
            btnToggleTema.textContent = "🌙 Ganti ke Mode Terang (Light Mode)";
            btnToggleTema.style.backgroundColor = "#5856d6";
        } else {
            btnToggleTema.textContent = "☀️ Ganti ke Mode Gelap (Dark Mode)";
            btnToggleTema.style.backgroundColor = "#ff9500";
        }
    });
}

function perbaruiEfekLatarBelakang(nilaiMentah) {
    if (!mainContentBg) return;
    mainContentBg.style.transition = "background 0.8s cubic-bezier(0.25, 1, 0.5, 1), background-image 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
    
    let lapisanGradien = "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85))";
    if (document.body.classList.contains("light-theme")) {
        lapisanGradien = "linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.82))";
    }

    if (nilaiMentah.includes("url")) {
        let tautanMurni = nilaiMentah;
        if (nilaiMentah.includes(",")) {
            tautanMurni = nilaiMentah.substring(nilaiMentah.indexOf("url"));
        }
        mainContentBg.style.backgroundImage = `${lapisanGradien}, ${tautanMurni}`;
    } else {
        if (nilaiMentah.includes("#1c1c1e") && document.body.classList.contains("light-theme")) {
            mainContentBg.style.backgroundImage = "none";
            mainContentBg.style.background = "linear-gradient(135deg, #f2f2f7 0%, #e5e5ea 100%)";
        } else {
            mainContentBg.style.backgroundImage = "none";
            mainContentBg.style.background = nilaiMentah;
        }
    }

    mainContentBg.style.backgroundSize = "cover";
    mainContentBg.style.backgroundPosition = "center";
    mainContentBg.style.backgroundAttachment = "fixed";
}

const tombolBg = document.querySelectorAll(".btn-bg-select");
tombolBg.forEach(btn => {
    btn.addEventListener("click", () => {
        const bgValue = btn.getAttribute("data-value") || btn.getAttribute("data-bg") || btn.dataset.bg;
        gambarSkripLokal = bgValue;
        perbaruiEfekLatarBelakang(bgValue);
    });
});

// ==========================================
// 9. SAKELAR NAVIGASI SIDEBAR INTERAKTIF SPA
// ==========================================
const menuMapping = [
    { menu: menuDashboard, page: pageDashboard, action: muatPortofolio },
    { menu: menuTambah, page: pageTambah, action: null },
    { menu: menuRiwayat, page: pageRiwayat, action: renderAccordionRiwayat },
    { menu: menuTrophy, page: pageTrophy, action: muatPortofolio },
    { menu: menuSettings, page: pageSettings, action: null }
];

menuMapping.forEach(item => {
    if (item.menu) {
        item.menu.addEventListener("click", (e) => {
            e.preventDefault();
            menuMapping.forEach(i => i.menu && i.menu.classList.remove("active"));
            item.menu.classList.add("active");
            
            menuMapping.forEach(i => {
                if (i.page) {
                    i.page.classList.remove("active-page");
                    i.page.classList.add("hidden-page");
                }
            });
            
            item.page.classList.remove("hidden-page");
            item.page.classList.add("active-page");
            
            if (item.action) item.action();
        });
    }
});

// =====================================================================
// ENGINE CANVAS PIXEL BONSAI LIVE + FALLING LEAVES
// =====================================================================
function jalankanEngineBonsaiPixel() {
    const canvas = document.getElementById("bonsaiCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let daftarDaunGugur = [];

    function gambarKotakPixel(x, y, w, h, warna) {
        ctx.fillStyle = warna;
        ctx.fillRect(Math.round(x), Math.round(y), w, h);
    }

    function loopAnimasiBonsai() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const isLightMode = document.body.classList.contains("light-theme");
        
        const warnaMeja = isLightMode ? "#8e8e93" : "#3a3a3c";
        const warnaPot = isLightMode ? "#636366" : "#2c2c2e";
        const warnaBatang = isLightMode ? "#4e3629" : "#3d281f"; 

        const warnaDaunTua = "#386641";   
        const warnaDaunMuda = "#6a994e";  
        const warnaDaunKuning = "#a7c957"; 
        const warnaDaunPucuk = "#f4f1de";  

        const waktuSekarang = Date.now() * 0.0028;
        const sisaGoyanganAngin = Math.sin(waktuSekarang) * 1.4; 

        gambarKotakPixel(6, 92, 108, 3, warnaMeja);
        gambarKotakPixel(12, 95, 4, 3, warnaMeja);
        gambarKotakPixel(104, 95, 4, 3, warnaMeja);

        gambarKotakPixel(18, 77, 84, 15, warnaPot);
        gambarKotakPixel(24, 92, 6, 2, warnaPot);
        gambarKotakPixel(90, 92, 6, 2, warnaPot);
        
        gambarKotakPixel(20, 75, 80, 2, "#4f5d23");
        gambarKotakPixel(22, 73, 76, 2, "#6a994e");

        gambarKotakPixel(50, 60, 16, 14, warnaBatang); 
        gambarKotakPixel(48, 64, 20, 10, warnaBatang); 
        
        gambarKotakPixel(54 + sisaGoyanganAngin * 0.2, 46, 14, 14, warnaBatang);  
        gambarKotakPixel(58 + sisaGoyanganAngin * 0.4, 34, 12, 12, warnaBatang);  
        gambarKotakPixel(64 + sisaGoyanganAngin * 0.6, 24, 8, 10, warnaBatang);  

        gambarKotakPixel(34 + sisaGoyanganAngin * 0.1, 56, 16, 5, warnaBatang);
        gambarKotakPixel(24 + sisaGoyanganAngin * 0.1, 52, 12, 4, warnaBatang);
        gambarKotakPixel(42 + sisaGoyanganAngin * 0.3, 42, 14, 4, warnaBatang);
        gambarKotakPixel(68 + sisaGoyanganAngin * 0.4, 44, 16, 5, warnaBatang);
        gambarKotakPixel(80 + sisaGoyanganAngin * 0.5, 40, 10, 4, warnaBatang);
        gambarKotakPixel(52 + sisaGoyanganAngin * 0.7, 20, 12, 4, warnaBatang);
        gambarKotakPixel(70 + sisaGoyanganAngin * 0.7, 18, 10, 3, warnaBatang);

        gambarKotakPixel(12 + sisaGoyanganAngin * 0.1, 46, 28, 8, warnaDaunTua);
        gambarKotakPixel(14 + sisaGoyanganAngin * 0.1, 44, 24, 10, warnaDaunMuda);
        gambarKotakPixel(18 + sisaGoyanganAngin * 0.1, 42, 18, 5, warnaDaunKuning); 
        gambarKotakPixel(22 + sisaGoyanganAngin * 0.1, 40, 10, 3, warnaDaunPucuk);  

        gambarKotakPixel(32 + sisaGoyanganAngin * 0.3, 36, 24, 8, warnaDaunTua);
        gambarKotakPixel(34 + sisaGoyanganAngin * 0.3, 34, 20, 9, warnaDaunMuda);
        gambarKotakPixel(38 + sisaGoyanganAngin * 0.3, 32, 14, 4, warnaDaunKuning);

        gambarKotakPixel(64 + sisaGoyanganAngin * 0.5, 36, 36, 9, warnaDaunTua);
        gambarKotakPixel(66 + sisaGoyanganAngin * 0.5, 32, 32, 11, warnaDaunMuda);
        gambarKotakPixel(72 + sisaGoyanganAngin * 0.5, 30, 22, 5, warnaDaunKuning); 
        gambarKotakPixel(76 + sisaGoyanganAngin * 0.5, 28, 14, 3, warnaDaunPucuk);  

        gambarKotakPixel(74 + sisaGoyanganAngin * 0.6, 46, 24, 8, warnaDaunTua);
        gambarKotakPixel(76 + sisaGoyanganAngin * 0.6, 44, 20, 9, warnaDaunMuda);
        gambarKotakPixel(80 + sisaGoyanganAngin * 0.6, 42, 12, 4, warnaDaunKuning);

        gambarKotakPixel(38 + sisaGoyanganAngin * 0.6, 22, 26, 8, warnaDaunTua);
        gambarKotakPixel(40 + sisaGoyanganAngin * 0.6, 20, 22, 10, warnaDaunMuda);
        gambarKotakPixel(44 + sisaGoyanganAngin * 0.6, 18, 14, 4, warnaDaunKuning);

        gambarKotakPixel(62 + sisaGoyanganAngin * 0.7, 18, 28, 8, warnaDaunTua);
        gambarKotakPixel(64 + sisaGoyanganAngin * 0.7, 16, 24, 9, warnaDaunMuda);
        gambarKotakPixel(68 + sisaGoyanganAngin * 0.7, 14, 16, 4, warnaDaunPucuk);

        gambarKotakPixel(44 + sisaGoyanganAngin * 0.8, 8, 36, 10, warnaDaunTua);
        gambarKotakPixel(46 + sisaGoyanganAngin * 0.8, 4, 32, 11, warnaDaunMuda);
        gambarKotakPixel(50 + sisaGoyanganAngin * 0.8, 2, 24, 7, warnaDaunKuning); 
        gambarKotakPixel(54 + sisaGoyanganAngin * 0.8, 0, 14, 4, warnaDaunPucuk);  

        if (Math.random() < 0.022) {
            const kantongSitusGugur = [
                { x: 44 + sisaGoyanganAngin * 0.8 + Math.random() * 32, y: 10 },
                { x: 16 + sisaGoyanganAngin * 0.1 + Math.random() * 20, y: 44 },
                { x: 68 + sisaGoyanganAngin * 0.5 + Math.random() * 24, y: 32 }
            ];
            const situsTerpilih = kantongSitusGugur[Math.floor(Math.random() * kantongSitusGugur.length)];
            
            daftarDaunGugur.push({
                x: situsTerpilih.x,
                y: situsTerpilih.y,
                ukuranW: 4, 
                ukuranH: 3, 
                kecepatanY: 0.4 + Math.random() * 0.4,
                goyangSeno: Math.random() * 100,
                warna: [warnaDaunKuning, warnaDaunPucuk, "#f4f1de"][Math.floor(Math.random() * 3)]
            });
        }

        for (let i = daftarDaunGugur.length - 1; i >= 0; i--) {
            let daun = daftarDaunGugur[i];
            daun.y += daun.kecepatanY;
            daun.goyangSeno += 0.045;
            daun.x += Math.sin(daun.goyangSeno) * 0.38; 

            gambarKotakPixel(daun.x, daun.y, daun.ukuranW, daun.ukuranH, daun.warna);

            if (daun.y > 91) {
                daftarDaunGugur.splice(i, 1);
            }
        }

        requestAnimationFrame(loopAnimasiBonsai);
    }

    loopAnimasiBonsai();
}

// PROTEKSI UTAMA INITIAL LOAD DATA
document.addEventListener("DOMContentLoaded", async () => {
    await muatPortofolio();
    jalankanEngineBonsaiPixel();
});