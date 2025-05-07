import { MatomoTracker } from "ngx-matomo-client";
import { CookieConsentConfig, CookieValue } from "vanilla-cookieconsent";

function updateConsent(cookie: CookieValue, source: string, tracker: MatomoTracker) {
  // console.log(source, cookie);
  // if(cookie.categories.includes("necessary")) {
  //   // do nothing
  // }

  if(cookie.categories.includes("analytics")) {
    tracker.setCookieConsentGiven()
  } else {
    tracker.forgetCookieConsentGiven()
  }

//  if(cookie.categories.includes("ads")) {

//  }

}

export function cookieConsentConfig(
//  tracker: MatomoTracker
) : CookieConsentConfig {
  return {
    // autoClearCookies: true,
    // autoShow: true,
    // disablePageInteraction: false,
    // hideFromBots: true,
    manageScriptTags: false,
    // revision: 0,
    // root: null,
    // mode: 'opt-in',

    guiOptions: {
      consentModal: {
        layout: 'bar',
        position: 'bottom',
        equalWeightButtons: true,
        flipButtons: false,
      },
      preferencesModal: {
        layout: 'bar',
        position: 'left',
        equalWeightButtons: true,
        flipButtons: false,
      },
    },

    onFirstConsent: ({ cookie }) => {
//      updateConsent(cookie, 'onFirstConsent', tracker);
    },
    onConsent: ({ cookie }) => {
//      updateConsent(cookie, 'onConsent', tracker);
    },
    onChange: ({ cookie, changedCategories, changedServices }) => {
//      updateConsent(cookie, 'onChange', tracker);
    },
    onModalShow: ({ modalName }) => {},
    onModalHide: ({ modalName }) => {},
    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      //analytics: {
      //  enabled: false,
      //  readOnly: false,
      //},
      // ads: {
      //   enabled: false,
      //   readOnly: false,
      // },
    },

    language: {
      default: 'en',
      // autoDetect: "browser"
      translations: {
        en: {
          consentModal: {
            title: 'We use cookies!',
            description:
              'We would like to use additional cookies to get better analytics and improve our platform. The way we use these cookies should not impact the users privacy.',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            showPreferencesBtn: 'Manage individual preferences',
            // TODO: this does not correctly build a router link unfortunately :(
            footer: `
              <a ng-reflect-router-link="/impressum" href="/impressum" >Impressum</a>
              <a ng-reflect-router-link="/privacy-policy" href="/privacy-policy">Privacy Policy</a>
            `,
          },
          preferencesModal: {
            title: 'Manage cookie preferences',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            savePreferencesBtn: 'Accept current selection',
            closeIconLabel: 'Close modal',
            serviceCounterLabel: 'Service|Services',
            sections: [
              {
                title: 'Cookie Usage',
                description:
                  '',
              },
              {
                title:
                  'Strictly Necessary Cookies <span class="pm__badge">always enabled</span>',
                description: 'Basic cookies the website uses to store information.',
                linkedCategory: 'necessary',
              },
              //{
              //  title: 'Analytics Cookies',
              //  description: 'Cookies used to track users and create <b><i>anonymous</i></b> analytics.',
              //  linkedCategory: 'analytics',
              //},
              // {
              //   title: 'Advertisement Cookies',
              //   description: 'Category description',
              //   linkedCategory: 'ads',
              // },
            ],
          },
        },
      },
    },
  }
}