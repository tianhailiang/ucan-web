import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import sun.misc.BASE64Encoder;

public class WebSocketServer {
	public static List<Socket> clientSockets = new ArrayList<Socket>();

	public WebSocketServer() throws IOException {
		ServerSocket ss = new ServerSocket(30000);
		while (true) {
			Socket socket = ss.accept();
			clientSockets.add(socket);
			new ServerThread(socket).start();
		}
	}
	public static void main(String[] args) throws IOException {
		
		new WebSocketServer();
	}
	class ServerThread extends Thread {
		private Socket socket;

		public ServerThread(Socket socket) {
			this.socket = socket;
		}

		public void run() {
			try {
				InputStream in = socket.getInputStream();
				OutputStream out = socket.getOutputStream();
				byte[] buff = new byte[1024];
				String req = "";
				int count = in.read(buff);
				if (count > 0) {

					req = new String(buff, 0, count);
					System.out.println("��������" + req);

					String secKey = getSecWebSocketKey(req);
					System.out.println("secKey = " + secKey);
					String response = "HTTP/1.1 101 Switching Protocols\r\nUpgrade: "
							+ "websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: "
							+ getSecWebSocketAccept(secKey) + "\r\n\r\n";
					System.out.println("secAccept = "
							+ getSecWebSocketAccept(secKey));
					out.write(response.getBytes());
				}
				int hasRead = 0;
				
				while ((hasRead = in.read(buff)) > 0) {
					
					
					for (int i = 0; i < hasRead - 6; i++) {
						buff[i + 6] = (byte) (buff[i % 4 + 2] ^ buff[i + 6]);
					}
					String pushMsg = new String(buff, 6, hasRead - 6, "UTF-8");
					for (Iterator<Socket> it = WebSocketServer.clientSockets
							.iterator(); it.hasNext();) {
						try {
							Socket s = it.next();
							byte[] pushHead = new byte[2];
							pushHead[0] = buff[0];
							pushHead[1] = (byte) pushMsg.getBytes("UTF-8").length;
							s.getOutputStream().write(pushHead);
							s.getOutputStream()
									.write(pushMsg.getBytes("UTF-8"));
						} catch (SocketException ex) {
							it.remove();
						}

					}
				}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} finally {
				try {
					socket.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
	}
	private String getSecWebSocketKey(String req) {
		Pattern p = Pattern.compile("^(Sec-WebSocket-Key:).+",
				Pattern.CASE_INSENSITIVE | Pattern.MULTILINE);
		Matcher m = p.matcher(req);
		if (m.find()) {
			String foundstring = m.group();
			return foundstring.split(":")[1].trim();
		} else {
			return null;
		}
	}
	private String getSecWebSocketAccept(String key) throws Exception {
		String guid = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
		key += guid;
		MessageDigest md = MessageDigest.getInstance("SHA-1");
		md.update(key.getBytes("UTF-8"), 0, key.length());
		byte[] sha1Hash = md.digest();
		BASE64Encoder encoder = new BASE64Encoder();
		return encoder.encode(sha1Hash);
	}

}
