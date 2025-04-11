import Image from 'next/image';

type TestimonialCardProps = {
  quote: string;
  customerName: string;
  location: string;
  image?: string;
};

export default function TestimonialCard({ quote, customerName, location, image }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <svg className="h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      
      <p className="text-textDark mb-4 italic">{quote}</p>
      
      <div className="flex items-center">
        {image && (
          <div className="mr-4">
            <Image 
              src={image} 
              alt={customerName}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          </div>
        )}
        <div>
          <h4 className="font-bold text-textDark">{customerName}</h4>
          <p className="text-accent text-small">{location}</p>
        </div>
      </div>
    </div>
  );
}
