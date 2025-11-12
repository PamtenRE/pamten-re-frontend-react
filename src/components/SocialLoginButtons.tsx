export default function SocialLoginButtons() {
  return (
    <div className="flex flex-col gap-3 mt-4">
      <button className="w-full p-2 border border-gray-600 rounded flex items-center justify-center gap-2 hover:bg-gray-700 transition">
        <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
        Sign in with Google
      </button>
      <button className="w-full p-2 border border-gray-600 rounded flex items-center justify-center gap-2 hover:bg-gray-700 transition">
        <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-5 h-5" />
        Sign in with LinkedIn
      </button>
    </div>
  );
}
