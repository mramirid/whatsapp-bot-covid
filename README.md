# WhatsApp Bot COVID-19 Indonesia

A WhatsApp chatbot that provides COVID-19 statistics in Indonesia.

This bot utilizes Twilio Messaging Service to make itself available on WhatsApp. The messaging service is then integrated with the bot's backend. The backend handles the messages sent by users and generates responses for them. You can find the tutorial on how to create a backend for WhatsApp chatbot using NestJS and how to integrate it with Twilio in this article: [Create a WhatsApp Bot to Discover Restaurants using Twilio and Node.js](https://www.twilio.com/blog/whatsapp-bot-discover-restaurants-twilio-node-js).

This project is now in version 2. We have removed the feature to search COVID-19 statistics at provincial level, because we could not find any API that provides such data. The first version can be found in the [V1 - The Legacy Codebase](https://github.com/mramirid/whatsapp-bot-covid/releases/tag/v1) release.

## Screenshots

| Hallo & Help                                                                                                                                                                                                                  | Get Statistics                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://res.cloudinary.com/mramirid/image/upload//fl_attachment:IMG_20230514_063209_kyxxqh//v1684021458/whatsapp-bot-covid-indonesia/IMG_20230514_063209_kyxxqh.jpg?_s=public-apps" alt="Landing Page" width="300"> | <img src="https://res.cloudinary.com/mramirid/image/upload//fl_attachment:IMG_20230514_063253_kjzehs//v1684021461/whatsapp-bot-covid-indonesia/IMG_20230514_063253_kjzehs.jpg?_s=public-apps" width="300" alt="Property Details"> |

## Sequence Diagram

[![](https://mermaid.ink/img/pako:eNqNVFtr2zAU_isHvSSFlMIe_VBI3Y71YW2JXcqKIRys40RMljxJXslC_vvkW7FnJUwPxtZ30aejYx1ZrjmxiFn6VZPK6V7gzmCZKfCjQuNELipUDtIPIYU-N78hW2ll6VE5MjlVTps5dV1VsVbOaCkpDCdkfouc5lisay88nMcx3wemXyvrDGG5fnnMVAd3eeH69naaJ4KX5ySFG_gQbu9NDlIjhyMs7jQ_LCJY3Ci0QiuUCzh1VhP94NhHjGBH7qlXLK8-BT3csqebahWJQ2e_k7W4o0E1pV1UXpI0FWqZy_j59Snd_Ngm6TpNtvE6_vbQ61D2peRgGz8ovBHvsNa3weA6FGEs6wQkLU3dlHYzx3nS0aG1eQfKeIPNGPHCkb6SGy2-3JAH4Qs4UZIFUUCBQhK_uhimL5sNl20FRbdGG653omF__3FwUucoxR-6eHr_dlZLhrLrknlnBVo7rBg3byM6-ysHDc6yx2aD8m3vn37JkAVM6L564HyTzRVsxUoyJQru76tj45AxzywpY5F_5Wh-ZixTJ8_D2unkoHIWOVPTitUVRzfcbSwq0Lfmivkr4l3r4fv0F346uAg?type=png)](https://mermaid.live/edit#pako:eNqNVFtr2zAU_isHvSSFlMIe_VBI3Y71YW2JXcqKIRys40RMljxJXslC_vvkW7FnJUwPxtZ30aejYx1ZrjmxiFn6VZPK6V7gzmCZKfCjQuNELipUDtIPIYU-N78hW2ll6VE5MjlVTps5dV1VsVbOaCkpDCdkfouc5lisay88nMcx3wemXyvrDGG5fnnMVAd3eeH69naaJ4KX5ySFG_gQbu9NDlIjhyMs7jQ_LCJY3Ci0QiuUCzh1VhP94NhHjGBH7qlXLK8-BT3csqebahWJQ2e_k7W4o0E1pV1UXpI0FWqZy_j59Snd_Ngm6TpNtvE6_vbQ61D2peRgGz8ovBHvsNa3weA6FGEs6wQkLU3dlHYzx3nS0aG1eQfKeIPNGPHCkb6SGy2-3JAH4Qs4UZIFUUCBQhK_uhimL5sNl20FRbdGG653omF__3FwUucoxR-6eHr_dlZLhrLrknlnBVo7rBg3byM6-ysHDc6yx2aD8m3vn37JkAVM6L564HyTzRVsxUoyJQru76tj45AxzywpY5F_5Wh-ZixTJ8_D2unkoHIWOVPTitUVRzfcbSwq0Lfmivkr4l3r4fv0F346uAg)

## Running the Bot

1. Install the dependencies

```bash
npm ci
```

2.  Run the backend. Ensure port 3000 is available to use.

```bash
npm start
```

3. Run ngrok. We need to run it in order to expose the backend to the internet, so then Twilio can connect to it.

```bash
npx ngrok 3000
```

You might not need to do step 3 if you are deploying the backend onto a hosting provider.

4. Integrate the backend with Twilio. For detailed instructions on how to do it, please refer to this article [Create a WhatsApp Bot to Discover Restaurants using Twilio and Node.js](https://www.twilio.com/blog/whatsapp-bot-discover-restaurants-twilio-node-js).
