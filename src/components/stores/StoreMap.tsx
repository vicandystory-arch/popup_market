import { useMemo } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

interface StoreMapProps {
  latitude: number
  longitude: number
  storeName: string
  address?: string
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
}

const defaultOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
}

export function StoreMap({ latitude, longitude, storeName, address }: StoreMapProps) {
  const center = useMemo(() => ({ lat: latitude, lng: longitude }), [latitude, longitude])

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!googleMapsApiKey) {
    return (
      <div className="h-96 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500 p-4">
        <svg
          className="w-16 h-16 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <p className="text-center text-sm">
          지도를 표시하려면 Google Maps API 키가 필요합니다.
        </p>
        <p className="text-center text-xs mt-2">
          환경 변수에 VITE_GOOGLE_MAPS_API_KEY를 설정해주세요.
        </p>
        {address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Google Maps에서 보기
          </a>
        )}
      </div>
    )
  }

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        options={defaultOptions}
      >
        <Marker
          position={center}
          title={storeName}
          label={storeName}
        />
      </GoogleMap>
    </LoadScript>
  )
}



