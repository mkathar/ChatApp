<template>
  <div class="contact">
    <h1 class="contact__title">Contact Us</h1>
    <div class="contact__content">
      <div class="contact__content__form">
        <input
          class="contact__content__form__name"
          type="text"
          placeholder="Name"
        />
        <input
          class="contact__content__form__email"
          type="text"
          placeholder="Email"
        />
        <textarea
          class="contact__content__form__message"
          type="text"
          placeholder="Message"
        />
        <button class="contact__content__form__btn">Send</button>
      </div>
      <div class="contact__content__communication">
        <p class="contact__content__communication__des">
          Nam mollis felis elementum, placerat dolor id, vehicula libero. Etiam
          dui nisl, mattis ut rhoncus et, cursus ut diam.
        </p>
        <div class="contact__content__communication__tel">
          <Icon name="phone" />
          <p>Tel:</p>
          <a href="">010-020-0340</a>
        </div>
        <div class="contact__content__communication__mail">
          <Icon name="mail" />
          <p>Email:</p>
          <a href="">info@domain.com</a>
        </div>
        <div class="contact__content__communication__web">
          <Icon name="web" />
          <p>Web:</p>
          <a href="">www.domain.com</a>
        </div>
      </div>
      <div class="contact__content__map"></div>
    </div>
  </div>
</template>

<script>
import { Icon } from "../icon";

export default {
  data() {
    return {};
  },
  components: {
    Icon: Icon,
  },
};
</script>
