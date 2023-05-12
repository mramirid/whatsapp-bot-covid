import Joi, { type InterfaceFrom } from 'types-joi';

export const envSchema = Joi.object({
  COUNTRY_STATS_URL: Joi.string().required(),
}).required();

export type Env = InterfaceFrom<typeof envSchema>;
