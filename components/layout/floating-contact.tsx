'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Headphones, MessageCircle, X } from 'lucide-react';
import { contactsService } from '@/services/api';
import { Contact, ContactType } from '@/types/contact';

const contactIcons: Record<ContactType, string> = {
  facebook: '/icons/fb.png',
  zalo: '/icons/zalo.png',
  phone: '/icons/phone.png',
};

const contactLabels: Record<ContactType, string> = {
  facebook: 'Messenger',
  zalo: 'Zalo',
  phone: 'Hotline',
};

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchContacts = async () => {
      try {
        const response = await contactsService.getContacts();
        if (response.success && response.data && Array.isArray(response.data)) {
          const activeContacts = response.data.filter((c) => c.is_active);
          setContacts(activeContacts);
        }
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  if (!mounted || contacts.length === 0) {
    return null;
  }

  const handleContactClick = (contact: Contact) => {
    if (contact.type === 'phone') {
      window.location.href = `tel:${contact.value}`;
    } else if (contact.link) {
      window.open(contact.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="fixed right-2 bottom-6 z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Contact Items - appear from bottom to top with staggered animation */}
      <div className="flex flex-col gap-3 mb-3">
        {contacts.map((contact, index) => (
          <button
            key={contact.id}
            onClick={() => handleContactClick(contact)}
            className="group flex items-center gap-3 bg-white rounded-full shadow-lg hover:shadow-xl pr-4 pl-1 py-1 origin-right cursor-pointer opacity-90 hover:opacity-100"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
              pointerEvents: isOpen ? 'auto' : 'none',
              transition: `all 0.3s ease-out ${isOpen ? (contacts.length - 1 - index) * 0.08 : index * 0.05}s`,
            }}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-50">
              <Image
                src={contactIcons[contact.type]}
                alt={contactLabels[contact.type]}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-800">
                {contactLabels[contact.type]}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Toggle Button with rotation effect and icon transition */}
      <button
        className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center bg-red-500 relative overflow-hidden"
        style={{
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.4s ease-in-out',
        }}
      >
        <Headphones
          className="w-6 h-6 text-white absolute"
          style={{
            opacity: isOpen ? 0 : 1,
            transform: isOpen ? 'scale(0)' : 'scale(1)',
            transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
          }}
        />
        {/* X icon - visible when open */}
        <X
          className="w-6 h-6 text-white absolute"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'scale(1) rotate(-90deg)' : 'scale(0) rotate(-90deg)',
            transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
          }}
        />
      </button>
    </div>
  );
}
