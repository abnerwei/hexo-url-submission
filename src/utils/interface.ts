
interface ChannelConfig {
  count: string,
  user: string,
  token: string,
  key: string
}

interface Channel {
  [key: string]: ChannelConfig | undefined
}

export interface GoogleKeys {
  type: string,
  project_id: string,
  private_key_id: string,
  private_key: string,
  client_email: string,
  client_id: string,
  auth_uri: string,
  token_uri: string,
  auth_provider_x509_cert_url: string,
  client_x509_cert_url: string
}

export interface UrlSubmission {
  enable: boolean,
  type: string
  prefix: Array<string>,
  ignore: Array<string>,
  channels: Channel,
  count: number,
  proxy: string,
  urls_path: string,
  sitemap: string
}