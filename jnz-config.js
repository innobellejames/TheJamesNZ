/* =====================================================================
   The James NZ — SETTINGS YOU CAN EDIT
   Paste your links between the quote marks, save, and upload this file.
   Anything left empty ('') stays hidden on the website, so nothing breaks.
   ===================================================================== */
window.JNZ_CONFIG = {

  /* 1. "Buy us a coffee" link — from Ko-fi, Buy Me a Coffee or a Stripe
        payment link. Example: 'https://ko-fi.com/thejamesnz' */
  supportUrl: '',

  /* 2. Monthly email sign-up — the "form action" web address from your
        email service (MailerLite, Buttondown, Mailchimp ...).
        Buttondown example: 'https://buttondown.com/api/emails/embed-subscribe/thejamesnz'
        emailField is the name of the email box in that form:
        Buttondown/Mailchimp 'email' (Mailchimp: 'EMAIL'), MailerLite 'fields[email]'. */
  newsletterAction: '',
  newsletterEmailField: 'email',

  /* 3. Contact email shown on the Privacy & Terms page (required by the
        Privacy Act so people can ask about their information). */
  contactEmail: '',

  /* 4. Google AdSense. Auto ads work with just the code already in
        index.html — switch on "Auto ads" in your AdSense account.
        Optional: paste a display ad unit's slot number for an extra ad
        space at the end of pages. Example: '1234567890' */
  adClient: 'ca-pub-8252604307690610',
  adSlot: '',

  /* 5. Printables shop — paste the link to each product's page on your
        shop (Payhip, Gumroad, Etsy ...). Empty = shows "Coming soon".
        Prices are what the website displays; keep them the same as your shop. */
  shop: {
    'kiwi-bucket-list':      { url: '', price: 'NZ$9' },
    'school-holiday-fun':    { url: '', price: 'NZ$8' },
    'family-money-planner':  { url: '', price: 'NZ$7' },
    'advent-christmas-pack': { url: '', price: 'NZ$7' },
    'lent-easter-pack':      { url: '', price: 'NZ$7' },
    'family-prayer-cards':   { url: '', price: 'NZ$6' },
    'lunchbox-joke-cards':   { url: '', price: 'NZ$5' }
  },

  /* 6. Say "incl. GST" next to prices? Only set to true once you are
        GST-registered (required when turnover is over $60,000 a year). */
  gstRegistered: false
};
