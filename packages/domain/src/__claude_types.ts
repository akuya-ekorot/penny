// Base Types
type WhatsAppId = string
type WhatsAppPhoneNumber = string
type WhatsAppMessageId = string
type WhatsAppLanguageCode = string

// Common Types
interface BaseMessage {
  messaging_product: "whatsapp"
  recipient_type?: "individual"
  to: WhatsAppPhoneNumber
  context?: {
    message_id: WhatsAppMessageId
  }
}

// Media Types
interface MediaContent {
  id?: string
  link?: string
  caption?: string
  filename?: string
}

// Text Message
interface TextMessage extends BaseMessage {
  type: "text"
  text: {
    preview_url?: boolean
    body: string
  }
}

// Reaction Message
interface ReactionMessage extends BaseMessage {
  type: "reaction"
  reaction: {
    message_id: WhatsAppMessageId
    emoji: string
  }
}

// Media Messages
interface MediaMessage extends BaseMessage {
  type: "audio" | "document" | "image" | "sticker" | "video"
  [key: string]: MediaContent | any
}

// Location Message
interface LocationMessage extends BaseMessage {
  type: "location"
  location: {
    latitude: number
    longitude: number
    name: string
    address: string
  }
}

// Contact Types
interface ContactName {
  formatted_name: string
  first_name?: string
  last_name?: string
  middle_name?: string
  suffix?: string
  prefix?: string
}

interface ContactEmail {
  email: string
  type?: "HOME" | "WORK"
}

interface ContactPhone {
  phone: string
  type?: "CELL" | "MAIN" | "IPHONE" | "HOME" | "WORK"
  wa_id?: string
}

interface ContactAddress {
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  country_code?: string
  type?: "HOME" | "WORK"
}

interface Contact {
  addresses?: Array<ContactAddress>
  birthday?: string
  emails?: Array<ContactEmail>
  name: ContactName
  org?: {
    company?: string
    department?: string
    title?: string
  }
  phones?: Array<ContactPhone>
  urls?: Array<{
    url: string
    type?: "HOME" | "WORK"
  }>
}

interface ContactMessage extends BaseMessage {
  type: "contacts"
  contacts: Array<Contact>
}

// Interactive Messages
interface InteractiveButton {
  type: "reply"
  reply: {
    id: string
    title: string
  }
}

interface InteractiveSection {
  title?: string
  rows?: Array<{
    id: string
    title: string
    description?: string
  }>
  product_items?: Array<{
    product_retailer_id: string
  }>
}

interface InteractiveMessage extends BaseMessage {
  type: "interactive"
  interactive: {
    type: "button" | "list" | "product" | "product_list" | "catalog_message" | "flow"
    header?: {
      type: "text" | "video" | "image" | "document"
      text?: string
      video?: MediaContent
      image?: MediaContent
      document?: MediaContent
    }
    body: {
      text: string
    }
    footer?: {
      text: string
    }
    action: {
      button?: string
      buttons?: Array<InteractiveButton>
      sections?: Array<InteractiveSection>
      catalog_id?: string
      product_retailer_id?: string
    }
  }
}

// Template Message
type TemplateComponentType = "header" | "body" | "button" | "footer"
type TemplateParameterType = "text" | "currency" | "date_time" | "image" | "document" | "video"

interface TemplateComponent {
  type: TemplateComponentType
  sub_type?: "quick_reply" | "url"
  index?: string
  parameters: Array<{
    type: TemplateParameterType
    text?: string
    currency?: {
      fallback_value: string
      code: string
      amount_1000: number
    }
    date_time?: {
      fallback_value: string
    }
    image?: MediaContent
    document?: MediaContent
    video?: MediaContent
  }>
}

interface TemplateMessage extends BaseMessage {
  type: "template"
  template: {
    name: string
    language: {
      code: WhatsAppLanguageCode
    }
    components?: Array<TemplateComponent>
  }
}

// Union type for all possible message types
type WhatsAppMessage =
  | TextMessage
  | ReactionMessage
  | MediaMessage
  | LocationMessage
  | ContactMessage
  | InteractiveMessage
  | TemplateMessage

// Response types
interface WhatsAppMessageResponse {
  messaging_product: "whatsapp"
  contacts: Array<{
    input: string
    wa_id: string
  }>
  messages: Array<{
    id: string
    message_status?: "accepted" | "held_for_quality_assessment"
  }>
}
