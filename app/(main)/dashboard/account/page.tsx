import { Suspense } from "react";
import { 
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  FileText,
  Edit,
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Mock account data
const accountData = {
  company: {
    name: "Mustermann Autoteile GmbH",
    customerNumber: "HD-2024-001",
    taxNumber: "DE123456789",
    vatNumber: "DE987654321",
    industry: "Kfz-Handel & Werkstatt",
    foundedYear: "1995",
    employees: "25-50"
  },
  contact: {
    firstName: "Max",
    lastName: "Mustermann", 
    position: "Geschäftsführer",
    email: "max@mustermann-gmbh.de",
    phone: "+49 30 12345678",
    mobile: "+49 170 1234567"
  },
  address: {
    street: "Musterstraße 123",
    zipCode: "10115",
    city: "Berlin",
    country: "Deutschland"
  },
  billing: {
    sameAsAddress: true,
    street: "Musterstraße 123",
    zipCode: "10115", 
    city: "Berlin",
    country: "Deutschland"
  },
  paymentMethods: [
    {
      id: "1",
      type: "bank_transfer",
      name: "Banküberweisung",
      details: "IBAN: DE89 3704 0044 0532 0130 00",
      isDefault: true
    },
    {
      id: "2", 
      type: "credit_limit",
      name: "Kreditlimit", 
      details: "€25,000 verfügbar",
      isDefault: false
    }
  ],
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderConfirmations: true,
    priceAlerts: true,
    stockAlerts: true,
    language: "de",
    currency: "EUR",
    timezone: "Europe/Berlin"
  }
};

const activityLog = [
  {
    id: "1",
    action: "Profil bearbeitet",
    details: "Kontaktdaten aktualisiert",
    timestamp: "2024-01-15T10:30:00Z",
    ip: "192.168.1.100"
  },
  {
    id: "2",
    action: "Passwort geändert", 
    details: "Sicherheitsupdate",
    timestamp: "2024-01-10T14:15:00Z",
    ip: "192.168.1.100"
  },
  {
    id: "3",
    action: "Anmeldung",
    details: "Dashboard Zugriff",
    timestamp: "2024-01-15T09:00:00Z", 
    ip: "192.168.1.100"
  }
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function AccountPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Konto-Einstellungen</h1>
          <p className="mt-1 text-sm text-gray-500">
            Verwalten Sie Ihre Firmeninformationen, Kontaktdaten und Präferenzen
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Kontoauszug
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Änderungen speichern
          </Button>
        </div>
      </div>

      {/* Account Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Konto Status</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                  <Badge variant="outline">Verifiziert</Badge>
                  <Badge variant="outline">Premium</Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Kunde seit</p>
              <p className="font-medium">März 2020</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="company">Unternehmen</TabsTrigger>
          <TabsTrigger value="billing">Abrechnung</TabsTrigger>
          <TabsTrigger value="preferences">Einstellungen</TabsTrigger>
          <TabsTrigger value="security">Sicherheit</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Persönliche Daten
                </CardTitle>
                <CardDescription>
                  Ihre persönlichen Kontaktinformationen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Vorname</Label>
                    <Input id="firstName" defaultValue={accountData.contact.firstName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nachname</Label>
                    <Input id="lastName" defaultValue={accountData.contact.lastName} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" defaultValue={accountData.contact.position} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" type="email" defaultValue={accountData.contact.email} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" defaultValue={accountData.contact.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobil</Label>
                    <Input id="mobile" defaultValue={accountData.contact.mobile} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Adresse
                </CardTitle>
                <CardDescription>
                  Ihre Firmenadresse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Straße & Hausnummer</Label>
                  <Input id="street" defaultValue={accountData.address.street} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">PLZ</Label>
                    <Input id="zipCode" defaultValue={accountData.address.zipCode} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Stadt</Label>
                    <Input id="city" defaultValue={accountData.address.city} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Land</Label>
                  <Input id="country" defaultValue={accountData.address.country} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Unternehmensdaten
              </CardTitle>
              <CardDescription>
                Informationen zu Ihrem Unternehmen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Firmenname</Label>
                  <Input id="companyName" defaultValue={accountData.company.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerNumber">Kundennummer</Label>
                  <Input id="customerNumber" defaultValue={accountData.company.customerNumber} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxNumber">Steuernummer</Label>
                  <Input id="taxNumber" defaultValue={accountData.company.taxNumber} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatNumber">USt-IdNr.</Label>
                  <Input id="vatNumber" defaultValue={accountData.company.vatNumber} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Branche</Label>
                  <Input id="industry" defaultValue={accountData.company.industry} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employees">Mitarbeiterzahl</Label>
                  <Input id="employees" defaultValue={accountData.company.employees} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Zahlungsmethoden
                </CardTitle>
                <CardDescription>
                  Verwaltung Ihrer Zahlungsoptionen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {accountData.paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.details}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && (
                        <Badge variant="secondary">Standard</Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Zahlungsmethode hinzufügen
                </Button>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Rechnungsadresse</CardTitle>
                <CardDescription>
                  Adresse für Rechnungsstellung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="sameAsAddress" defaultChecked={accountData.billing.sameAsAddress} />
                  <Label htmlFor="sameAsAddress">Gleiche Adresse wie Firmenadresse</Label>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="billingStreet">Straße & Hausnummer</Label>
                    <Input id="billingStreet" defaultValue={accountData.billing.street} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingZipCode">PLZ</Label>
                      <Input id="billingZipCode" defaultValue={accountData.billing.zipCode} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingCity">Stadt</Label>
                      <Input id="billingCity" defaultValue={accountData.billing.city} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Benachrichtigungen
                </CardTitle>
                <CardDescription>
                  Wählen Sie, wie Sie benachrichtigt werden möchten
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>E-Mail Benachrichtigungen</Label>
                    <p className="text-sm text-gray-500">Allgemeine Updates per E-Mail</p>
                  </div>
                  <Switch defaultChecked={accountData.preferences.emailNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Benachrichtigungen</Label>
                    <p className="text-sm text-gray-500">Wichtige Updates per SMS</p>
                  </div>
                  <Switch defaultChecked={accountData.preferences.smsNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing E-Mails</Label>
                    <p className="text-sm text-gray-500">Produktneuheiten und Angebote</p>
                  </div>
                  <Switch defaultChecked={accountData.preferences.marketingEmails} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bestellbestätigungen</Label>
                    <p className="text-sm text-gray-500">Automatische Bestellbestätigungen</p>
                  </div>
                  <Switch defaultChecked={accountData.preferences.orderConfirmations} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Preisalerts</Label>
                    <p className="text-sm text-gray-500">Bei Preisänderungen benachrichtigen</p>
                  </div>
                  <Switch defaultChecked={accountData.preferences.priceAlerts} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Lagerbestand Alerts</Label>
                    <p className="text-sm text-gray-500">Bei niedrigem Lagerbestand</p>
                  </div>
                  <Switch defaultChecked={accountData.preferences.stockAlerts} />
                </div>
              </CardContent>
            </Card>

            {/* Regional Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Regionale Einstellungen</CardTitle>
                <CardDescription>
                  Sprache, Währung und Zeitzone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Sprache</Label>
                  <Input id="language" defaultValue="Deutsch" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Währung</Label>
                  <Input id="currency" defaultValue="Euro (EUR)" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zeitzone</Label>
                  <Input id="timezone" defaultValue="Berlin (UTC+1)" disabled />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Passwort & Sicherheit
                </CardTitle>
                <CardDescription>
                  Verwalten Sie Ihr Passwort und Sicherheitseinstellungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Neues Passwort</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="w-full">
                  Passwort ändern
                </Button>
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle>Aktivitätsverlauf</CardTitle>
                <CardDescription>
                  Ihre letzten Kontoaktivitäten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLog.map((activity) => (
                    <div key={activity.id} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.details}</p>
                        <p className="text-xs text-gray-400">{formatDate(activity.timestamp)}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.ip}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Vollständigen Verlauf anzeigen
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const metadata = {
  title: "Konto-Einstellungen | Händlerportal",
  description: "Verwalten Sie Ihre Firmeninformationen, Kontaktdaten und Präferenzen",
};