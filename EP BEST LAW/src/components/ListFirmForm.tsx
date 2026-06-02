import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card } from './ui/card';
import { categories } from '../data/categories';
import { useToast } from '../hooks/use-toast';

export default function ListFirmForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    categories: [] as string[],
    about: '',
    plan: 'Free',
    consent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      toast({
        title: 'Consent Required',
        description: 'Please agree to the advertising disclosure.',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Success!',
      description: 'Your firm listing has been submitted for review.'
    });
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      categories: [],
      about: '',
      plan: 'Free',
      consent: false
    });
  };

  return (
    <Card className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-[#0F2A43] mb-6">List Your Law Firm</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Firm Name *</Label>
            <Input 
              id="name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input 
              id="phone" 
              required 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input 
              id="website" 
              type="url" 
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="address">Address *</Label>
          <Input 
            id="address" 
            required 
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </div>
        
        <div>
          <Label htmlFor="about">About Your Firm</Label>
          <Textarea 
            id="about" 
            rows={4} 
            value={formData.about}
            onChange={(e) => setFormData({...formData, about: e.target.value})}
          />
        </div>
        
        <div>
          <Label htmlFor="plan">Select Plan</Label>
          <Select value={formData.plan} onValueChange={(val) => setFormData({...formData, plan: val})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Basic">Basic - $9.99/mo</SelectItem>
              <SelectItem value="Professional">Professional - $39.99/mo</SelectItem>
              <SelectItem value="Expert">Expert - $99.99/mo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="consent" 
            checked={formData.consent}
            onCheckedChange={(checked) => setFormData({...formData, consent: checked as boolean})}
          />
          <Label htmlFor="consent" className="text-sm">
            I agree this is attorney advertising. *
          </Label>
        </div>
        
        <Button type="submit" className="w-full bg-[#1FA8A1] hover:bg-[#1FA8A1]/90" size="lg">
          Submit Listing
        </Button>
      </form>
    </Card>
  );
}


