/**
 * Unsubscribe page
 * Displays a simple form to unsubscribe from mailing list
 */
export default function UnsubscribePage() {
  return (
    <html>
      <body>
        <form method="post" action="/api/forms/unsubscribe">
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            required 
          />
          <button type="submit">Unsubscribe</button>
        </form>
      </body>
    </html>
  );
}
