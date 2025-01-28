import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import URLShortener from './components/URLShortener';
import LinkList from './components/LinkList';
import RotateWhatsApp from './components/RotateWhatsApp';
import WhatsAppLinkList from './components/WhatsAppLinkList';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center">URL Shortener</h1>
        
        <Tabs defaultValue="shorten" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="shorten">Shorten URL</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="whatsapp-links">WhatsApp Links</TabsTrigger>
          </TabsList>

          <TabsContent value="shorten">
            <URLShortener />
          </TabsContent>

          <TabsContent value="links">
            <LinkList />
          </TabsContent>

          <TabsContent value="whatsapp">
            <RotateWhatsApp />
          </TabsContent>

          <TabsContent value="whatsapp-links">
            <WhatsAppLinkList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
