# ChatApp (WhatsApp Clone)

Bu proje, gerçek zamanlı bir sohbet uygulamasıdır ve WhatsApp'ı temel alarak geliştirilmiştir. Kullanıcıların anlık mesajlaşmasını, çevrimiçi durumlarını takip etmesini ve diğer temel özellikleri sunar.

**Başlangıç Tarihi:** Ekim 2023

**Bitiş Tarihi:** Hala Geliştirilme Aşamasında

## Kullanılan Teknolojiler

- **Frontend:**
  - Vue.js 3
  - Vuex (state management)
  - Vue Router (navigation)
  - SCSS (styling)
  - BEM methodology (CSS yapılandırması)
  - Swiper (kaydırma efektleri için)
  - axios (API istekleri)
- **Backend:**
  - Node.js
  - Express.js
  - PostgreSQL (Veritabanı)
  - pg-promise (Veritabanı işlemleri için)
  - Socket.IO (Gerçek zamanlı mesajlaşma)
  - JWT (Kimlik doğrulama için)
  - bcrypt (Şifreleme için)

## Temel Özellikler

- **Kullanıcı Kayıt ve Kimlik Doğrulama:** Güvenli kullanıcı kaydı ve kimlik doğrulama JWT ve bcrypt kullanılarak sağlanır.
- **Gerçek Zamanlı Mesajlaşma:** Socket.IO ile anlık mesajlaşma özelliği.
- **Çevrimiçi Kullanıcı Durumu Takibi:** Kullanıcıların çevrimiçi/çevrimdışı durumlarını takip edebilme özelliği.
- **Kullanıcı ve Mesaj Arama:** Kullanıcıları ve mesajları arama özelliği.
- **Kullanıcı Profil Yönetimi:** Kullanıcıların profillerini yönetebilme özelliği.
- **Duyarlı Tasarım:** Farklı cihazlarda sorunsuz kullanım için duyarlı bir kullanıcı arayüzü.

## Güvenlik Önlemleri

- **CORS İlkeleri:** Güvenli oturum yönetimi için CORS ilkeleri kullanılmıştır.
- **HTTP-only Çerezler:** Oturum yönetimi için HTTP-only çerezler kullanılarak XSS ve CSRF saldırılarına karşı koruma sağlanır.

## Proje Yönetimi

- **Trello:** Projenin etkin yönetimi ve sürekli gelişim için Trello kullanılmıştır.

## Kurulum

1.  **Depoyu Klonlayın:**

    ```bash
    git clone https://github.com/mkathar/ChatApp.git
    ```

2.  **Proje Dizinine Girin:**

    ```bash
    cd ChatApp
    ```

3.  **Bağımlılıkları Yükleyin:**

    ```bash
    npm install
    ```

4.  **Veritabanı Ayarlarını Yapın:**

    - PostgreSQL veritabanını kurun ve bir veritabanı oluşturun.
    - `.env` dosyası içerisinde veritabanı bilgilerinizi tanımlayın.
      - Örn:
        - PORT=3000
        - DB_USER="kullanici_adi"
        - DB_PASSWORD="parola"
        - DB_NAME="veritabanı_adı"
        - DB_HOST=localhost
        - DB_PORT=5432

5.  **Sunucuyu Başlatın:**

    ```bash
    npm run server
    ```

6.  **Frontend'i Başlatın:**

    ```bash
        npm run dev
    ```

## Kullanım

1.  Uygulamayı tarayıcınızda açın (port bilgisi değişebilir, genellikle 8080 veya farklı bir portta çalışır).
2.  Kayıtlı bir kullanıcı ile giriş yapın (veya yeni bir kullanıcı kaydedin).
3.  Sohbet etmeye başlayın!

## Proje Yapısı

ChatApp/
├── assets/
│ └── scss/
| ├── base/
| ├── components/
| └── pages/
├── components/
│ ├── chatList.vue
│ ├── contact.vue
│ ├── ...
├── pages/
│ ├── process.vue
│ ├── textArea.vue
│ └── welcome.vue
├── router/
│ └── index.js
├── services/
│ └── base/
│ └── baseURL.js
├── database/
│ ├── controllers/
│ ├── chatController.js
│ ├── messageController.js
│ └── userController.js
| ├── queries/
| ├── chatQueries.js
| ├── messageQueries.js
| └── userQueries.js
│ ├── config.js
│ ├── db.js
│ └── dbOperations.js
├── store/
│ └── modules/
│ ├── auth.js
│ ├── chats.js
│ ├── messages.js
│ └── ui.js
├── App.vue
├── main.js
└── package.json

- `assets`: CSS (SCSS) dosyaları ve resimler.
- `components`: Vue.js bileşenleri.
- `pages`: Vue.js sayfaları.
- `router`: Vue Router yapılandırması.
- `services`: API servisleri.
- `database`: Veritabanı ile ilgili dosyalar.
- `store`: Vuex ile state management dosyaları.

## Katkıda Bulunma

Bu projeye katkıda bulunmak isterseniz, aşağıdaki adımları takip edebilirsiniz:

1.  **Fork** the repository.
2.  **Branch** oluşturun (`git checkout -b feature/my-new-feature`).
3.  **Değişikliklerinizi yapın.**
4.  **Commit** the changes (`git commit -m 'Add some feature'`).
5.  **Push** to the branch (`git push origin feature/my-new-feature`).
6.  **Pull request** oluşturun.

## Lisans

Bu proje MIT lisansı altında yayınlanmıştır.

## İletişim

Herhangi bir sorunuz veya öneriniz varsa, [e-posta adresinizi] üzerinden bana ulaşabilirsiniz.
