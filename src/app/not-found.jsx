import Link from 'next/link';
import Button from '@mui/material/Button';

export default function NotFound() {
  return (
    <div className="wrap min-h-[70vh] flex flex-col items-center justify-center text-center">
      <p className="label text-clay">404</p>
      <h1 className="font-serif text-7xl md:text-9xl leading-[0.9] mt-3">Not <em>found</em></h1>
      <p className="text-mute mt-4">This page has moved, or never existed.</p>
      <Button component={Link} href="/" variant="contained" sx={{ mt: 4 }}>Back to the edit</Button>
    </div>
  );
}
