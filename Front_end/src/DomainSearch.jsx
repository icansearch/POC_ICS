import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

const fetchDomainAvailability = async (domain) => {
  const CLOUDFLARE_URL = `https://cloudflare-dns.com/dns-query?name=${domain}&type=NS`;
  const response = await fetch(CLOUDFLARE_URL, {
    headers: { Accept: "application/dns-json" },
  });
  const data = await response.json();
  return !data.Answer; // If there's no NS record, it's likely available
};

const fetchAlternativeTLDs = async (domain) => {
  const tlds = [".net", ".org", ".io", ".co", ".xyz"];
  const availableTLDs = [];

  for (const tld of tlds) {
    const available = await fetchDomainAvailability(`${domain.split('.')[0]}${tld}`);
    if (available) availableTLDs.push(`${domain.split('.')[0]}${tld}`);
  }
  return availableTLDs;
};

const registrars = [
  {
    name: "GoDaddy",
    url: "https://www.godaddy.com/domainsearch/find?domainToCheck=",
    logo: "https://example.com/godaddy-logo.png",
  },
  {
    name: "Hostinger",
    url: "https://www.hostinger.com/domain-checker?domain=",
    logo: "https://example.com/hostinger-logo.png",
  },
  {
    name: "Namecheap",
    url: "https://www.namecheap.com/domains/registration/results/?domain=",
    logo: "https://example.com/namecheap-logo.png",
  },
  {
    name: "BigRock",
    url: "https://www.bigrock.in/domain-registration?search=",
    logo: "https://example.com/bigrock-logo.png",
  },
  {
    name: "One.com",
    url: "https://www.one.com/en/domain-registration/search?domain=",
    logo: "https://example.com/onecom-logo.png",
  },
];

const RegistrarCard = ({ registrar, domain }) => (
  <div className="flex items-center justify-between border-b py-4">
    <div className="flex items-center">
      <img src={registrar.logo} alt={`${registrar.name} logo`} className="w-12 h-12 mr-4" />
      <span className="text-lg font-medium">{registrar.name}</span>
    </div>
    <a
      href={`${registrar.url}${domain}`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
    >
      Buy Now
    </a>
  </div>
);

export default function DomainSearch() {
  const [domain, setDomain] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [alternativeTLDs, setAlternativeTLDs] = useState([]);

  const checkDomain = async () => {
    setIsAvailable(null);
    setAlternativeTLDs([]);

    const available = await fetchDomainAvailability(domain);
    setIsAvailable(available);

    if (!available) {
      const tlds = await fetchAlternativeTLDs(domain);
      setAlternativeTLDs(tlds);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <Input
        className="w-96"
        placeholder="Enter domain (e.g., example.com)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />
      <Button onClick={checkDomain}>Check Availability</Button>
      {isAvailable !== null && (
        <Card className="w-full max-w-3xl text-center p-4">
          <CardContent>
            {isAvailable ? (
              <>
                <Check className="text-green-500 w-6 h-6 mx-auto" />
                <p className="text-lg font-semibold mt-2">{domain} is available!</p>
                <p className="text-sm text-gray-500 mb-4">Purchase from one of the following registrars:</p>
                <div className="divide-y">
                  {registrars.map((reg) => (
                    <RegistrarCard key={reg.name} registrar={reg} domain={domain} />
                  ))}
                </div>
              </>
            ) : (
              <>
                <X className="text-red-500 w-6 h-6 mx-auto" />
                <p className="text-lg font-semibold mt-2">{domain} is already taken.</p>
                <p className="text-sm text-gray-500 mb-4">Consider these alternative domains:</p>
                <ul className="list-disc list-inside">
                  {alternativeTLDs.length > 0 ? (
                    alternativeTLDs.map((alt) => (
                      <li key={alt} className="text-blue-500 hover:underline">
                        {alt}
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">No alternative domains available.</p>
                  )}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
