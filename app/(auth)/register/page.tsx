"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/auth-client"
import { USER_ROLES } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, UserPlus } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: USER_ROLES.DEALER,
    companyName: "",
    customerNumber: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwörter stimmen nicht überein")
      setIsLoading(false)
      return
    }

    try {
      await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        companyName: formData.companyName,
        customerNumber: formData.customerNumber
      })
      
      router.push("/login")
    } catch (error: any) {
      setError(error.message || "Registrierung fehlgeschlagen")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Registrierung
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Neues Händlerkonto erstellen
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Händler-Registrierung
            </CardTitle>
            <CardDescription>
              Erstellen Sie Ihr neues Konto für den Zugang zu unserem B2B-Portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  placeholder="Ihr vollständiger Name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  placeholder="ihre@email.de"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Rolle</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={USER_ROLES.DEALER}>Händler</SelectItem>
                    <SelectItem value={USER_ROLES.SALES}>Vertrieb</SelectItem>
                    <SelectItem value={USER_ROLES.SUPPORT}>Support</SelectItem>
                    <SelectItem value={USER_ROLES.ADMIN}>Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyName">Firmenname (optional)</Label>
                <Input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Ihre Firma GmbH"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerNumber">Kundennummer (optional)</Label>
                <Input
                  id="customerNumber"
                  type="text"
                  value={formData.customerNumber}
                  onChange={(e) => handleInputChange("customerNumber", e.target.value)}
                  placeholder="KUND-12345"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Registrierung läuft...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrieren
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Bereits ein Konto?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Jetzt anmelden
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}