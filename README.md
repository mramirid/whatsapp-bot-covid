# WhatsApp Bot COVID-19 Indonesia

A WhatsApp chatbot to obtain COVID-19 statistics in Indonesia.

This bot utilizes the Twilio messaging service to make itself available on WhatsApp. The messaging service is then integrated with the bot's backend. The backend handles the messages sent by users and generates responses for them. You can find the tutorial on how to create a WhatsApp bot backend using NestJS and how to integrate it with Twilio in this article: [Create a WhatsApp Bot to Discover Restaurants using Twilio and Node.js](https://www.twilio.com/blog/whatsapp-bot-discover-restaurants-twilio-node-js).

This project is now in version 2. We have removed the feature to search COVID-19 statistics at provincial level, because we could not find any API that provides such data. The first version can be found in the [V1 - The Legacy Codebase](https://github.com/mramirid/whatsapp-bot-covid/releases/tag/v1) release.

## Screenshots

| Hallo & Help                                                                                                                                                                                                                  | Get Statistics                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://res.cloudinary.com/mramirid/image/upload//fl_attachment:IMG_20230514_063209_kyxxqh//v1684021458/whatsapp-bot-covid-indonesia/IMG_20230514_063209_kyxxqh.jpg?_s=public-apps" alt="Landing Page" width="300"> | <img src="https://res.cloudinary.com/mramirid/image/upload//fl_attachment:IMG_20230514_063253_kjzehs//v1684021461/whatsapp-bot-covid-indonesia/IMG_20230514_063253_kjzehs.jpg?_s=public-apps" width="300" alt="Property Details"> |
