export interface LeadSubmitData {
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
  situation: string;
  bedrooms: string;
  bathrooms: string;
  propertyCondition: string;
  notes?: string;
  fullName: string;
  phone: string;
  email: string;
  preferredContact: string;
}

export interface LeadResponse extends LeadSubmitData {
  id: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
