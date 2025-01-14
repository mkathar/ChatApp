# ChatApp (WhatsApp Klonu)

Bu proje, WhatsApp'tan ilham alınarak geliştirilmiş gerçek zamanlı bir sohbet uygulamasıdır. Kullanıcıların anlık mesajlar göndermesine, çevrimiçi durumları takip etmesine ve diğer temel özellikleri sunar.

[🇬🇧 İngilizce README](README.md)

**Başlangıç Tarihi:** Ekim 2023  
**Bitiş Tarihi:** Hala Geliştirme Aşamasında

## Kullanılan Teknolojiler

- **Önyüz (Frontend):**
  - Vue.js 3
  - Vuex (durum yönetimi)
  - Vue Router (navigasyon)
  - SCSS (stil oluşturma)
  - BEM metodolojisi (CSS yapılandırması)
  - Swiper (kaydırıcı efektleri için)
  - axios (API istekleri için)
- **Arka Uç (Backend):**
  - Node.js
  - Express.js
  - PostgreSQL (Veritabanı)
  - pg-promise (veritabanı işlemleri için)
  - Socket.IO (gerçek zamanlı mesajlaşma)
  - JWT (kimlik doğrulama için)
  - bcrypt (parola şifreleme için)

## Temel Özellikler

- 🔐 **Kullanıcı Kaydı ve Kimlik Doğrulama:** JWT ve bcrypt kullanarak güvenli kullanıcı kaydı ve kimlik doğrulama.
- ⚡ **Gerçek Zamanlı Mesajlaşma:** Socket.IO ile desteklenen anlık mesajlaşma.
- 👀 **Çevrimiçi Durum Takibi:** Kullanıcıların çevrimiçi/çevrimdışı durumlarını izleme yeteneği.
- 🔍 **Arama İşlevi:** Kullanıcıları ve mesajları arama.
- 👤 **Kullanıcı Profil Yönetimi:** Kullanıcı profillerini kolayca yönetme.
- 📱 **Duyarlı Tasarım:** Farklı cihazlarda sorunsuz kullanım için duyarlı bir kullanıcı arayüzü.

### Gelecek Özellikler

- 🏷️ Kullanıcı adı etiket sistemi (kullanıcıadı#1234)
- ✓ Okundu bilgisi
- ✏️ Mesaj düzenleme
- 📸 Hikaye paylaşımı
- 📎 Dosya paylaşımı
- 🔐 İki faktörlü kimlik doğrulama
- 🌐 Çoklu dil desteği
- 🎨 Tema özelleştirme
- 🔤 Uygulama içi dil seçimi

## Güvenlik Önlemleri

- **CORS Politikaları:** Güvenli oturum yönetimi için uygulanan CORS politikaları.
- **HTTP-only Çerezleri:** XSS ve CSRF saldırılarına karşı koruma sağlayan oturum yönetimi için HTTP-only çerezleri.

## Proje Yönetimi

- **Trello:** Etkili proje yönetimi ve sürekli geliştirme için Trello kullanıldı.

## Kurulum

1.  **Depoyu Klonlayın:**

    ```bash
    git clone https://github.com/mkathar/ChatApp.git
    ```

2.  **Proje Dizinine Gidin:**

    ```bash
    cd ChatApp
    ```

3.  **Bağımlılıkları Yükleyin:**

    ```bash
    npm install
    ```

4.  **Veritabanını Yapılandırın:**

    - Bir PostgreSQL veritabanı kurun ve yeni bir veritabanı oluşturun.
    - `.env` dosyasında veritabanı kimlik bilgilerinizi tanımlayın.
      - Örnek:
        ```
        PORT=3000
        DB_USER="kullanıcıadı"
        DB_PASSWORD="parola"
        DB_NAME="veritabanı_adı"
        DB_HOST=localhost
        DB_PORT=5432
        ```

5.  **Sunucuyu Başlatın:**

    ```bash
    npm start
    ```

6.  **Önyüzü Başlatın:**

    ```bash
    npm run dev
    ```

## Veritabanı Şeması

Veritabanı şeması ve SQL komutları için [İngilizce README](README.md#database-schema) dosyasına bakabilirsiniz.

Veritabanı yapısı:

- `users` - Kullanıcı bilgileri
- `chats` - Sohbet bilgileri
- `chat_participants` - Sohbet katılımcıları
- `messages` - Mesaj bilgileri
- `user_settings` - Kullanıcı ayarları
- `contacts` - Kişi listesi

**Not:** Veritabanını oluşturmak için önce PostgreSQL'i yüklediğinizden emin olun ve İngilizce README'deki adımları takip edin.

## Kullanım

1.  Uygulamayı tarayıcınızda açın (varsayılan port genellikle 8080 veya başka bir kullanılabilir porttur).
2.  Mevcut bir kullanıcı hesabıyla giriş yapın (veya yeni bir hesap kaydedin).
3.  Sohbet etmeye başlayın!

## Proje Yapısı

<pre>
ChatApp/
├── assets/
│   └── scss/
│       ├── base/
│       │   └── _reset.scss
│       ├── components/
│       │   ├── _chat-list.scss
│       │   ├── _contact.scss
│       │   ├── _hi.scss
│       │   ├── _index.scss
│       │   ├── _login.scss
│       │   ├── _newChatModal.scss
│       │   ├── _ourGallery.scss
│       │   ├── _ourWork.scss
│       │   ├── _sidebar-Message.scss
│       │   ├── _sidebar.scss
│       │   ├── _signIn.scss
│       │   ├── _text-FromMessage.scss
│       │   ├── _text-outgoingMessage.scss
│       │   ├── _textHeader.scss
│       │   └── _textNav.scss
│       └── pages/
│           ├── _textArea.scss
│           └── _welcome.scss
├── components/
│   ├── chatList.vue
│   ├── contact.vue
│   ├── conversationList.vue
│   ├── deleteChatModal.vue
│   ├── fromMessage.vue
│   ├── hi.vue
│   ├── login.vue
│   ├── message.vue
│   ├── messageList.vue
│   ├── newChatModal.vue
│   ├── ourGallery.vue
│   ├── ourWork.vue
│   ├── outgoingMessage.vue
│   ├── sidebar.vue
│   ├── sidebarMessage.vue
│   ├── signIn.vue
│   ├── text.vue
│   ├── textHeader.vue
│   ├── textNav.vue
│   └── textWrite.vue
├── pages/
│   ├── process.vue
│   ├── textArea.vue
│   └── welcome.vue
├── router/
│   └── index.js
├── services/
│   └── base/
│       └── baseURL.js
├── database/
│   ├── controllers/
│       ├── chatController.js
│       ├── messageController.js
│       └── userController.js
│   ├── queries/
│       ├── chatQueries.js
│       ├── messageQueries.js
│       └── userQueries.js
│   ├── config.js
│   ├── db.js
│   └── dbOperations.js
├── store/
│   └── modules/
│       ├── auth.js
│       ├── chats.js
│       ├── messages.js
│       └── ui.js
├── App.vue
├── main.js
└── package.json
</pre>

- `assets`: CSS (SCSS) dosyaları ve resimler.
- `components`: Vue.js bileşenleri.
- `pages`: Vue.js sayfaları.
- `router`: Vue Router yapılandırmaları.
- `services`: API servisleri.
- `database`: Veritabanı ile ilgili dosyalar.
- `store`: Vuex durum yönetimi dosyaları.

## Katkıda Bulunma

Bu projeye katkıda bulunmak isterseniz, şu adımları izleyin:

1.  Depoyu **Fork** edin.
2.  Bir **Branch Oluşturun** (`git checkout -b feature/benim-yeni-ozelligim`).
3.  **Değişikliklerinizi Yapın.**
4.  Değişikliklerinizi **Commit** edin (`git commit -m 'Bazı özellikler ekle'`).
5.  Branch'e **Push** edin (`git push origin feature/benim-yeni-ozelligim`).
6.  Bir **Pull Request** oluşturun.

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.

## İletişim

[LinkedIn](https://www.linkedin.com/in/muhammed-mustafa-katar-62a666245/)
