# SafeChildQR Frontend

Frontend for the SafeChildQR child safety and recovery platform. This React application lets parents create an account, manage child profiles, generate QR-based recovery pages, and handle scan interactions for finders.

## Tech Stack

- React
- React Router
- Axios
- React Toastify
- React Icons
- `react-qrcode-logo`
- `react-webcam`
- `jsqr`

## Main Features

- Parent signup and login
- Protected dashboard for parents
- Add, view, edit, and delete child profiles
- QR code generation for each child
- Download-ready QR display
- Public scan page for finders
- Call parent directly from the scan page
- Send WhatsApp alert to parent
- Share live location through WhatsApp when permission is granted
- Offline fallback that extracts the emergency number from the QR code

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   └── styles/
├── package.json
└── README.md
```

## Main Pages

- `/` - Landing page
- `/login` - Parent login
- `/signup` - Parent registration
- `/dashboard` - Parent dashboard
- `/child/:id` - Child details and QR management
- `/settings` - Parent account settings
- `/scanner` - Camera-based QR scanner
- `/scan/:code` - Public QR scan result page

## Environment Variables

Create a `.env` file inside `frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WEB_URL=http://localhost:3000
```

## Installation

```bash
cd frontend
npm install
```

## Available Scripts

```bash
npm start
```

Runs the app in development mode on `http://localhost:3000`.

```bash
npm run build
```

Builds the production bundle.

```bash
npm test
```

Runs the React test command.

## How It Works

1. Parent signs up or logs in.
2. Parent adds a child profile with an emergency message.
3. The app generates a QR value using:

```text
{REACT_APP_WEB_URL}/scan/{childId}+{emergencyNumber}
```

4. If someone scans the QR code:
   - Online mode loads child data from the backend
   - Finder can call the parent or send a WhatsApp alert
   - Finder can share location through WhatsApp if allowed
5. If internet is unavailable, the page falls back to the emergency number encoded in the QR.

## API Integration

The frontend uses `src/services/api.js` to talk to the backend.

- `POST /auth/signup`
- `POST /auth/login`
- `GET /parent/me`
- `PUT /parent/me`
- `DELETE /parent/me`
- `POST /child`
- `GET /child/:id`
- `PUT /child/:id`
- `DELETE /child/:id`
- `GET /scan/:code`

## Notes

- Authentication token is stored in `localStorage`.
- Protected routes depend on the auth context.
- The scan page supports online and offline behavior.
- The current QR flow uses child ID plus emergency number in the encoded URL.

## Future Improvements

- Real-time live location with Socket.io
- Push notifications
- Multi-language support
- Scan history analytics in the dashboard
- Mobile app support