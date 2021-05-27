package webapp.sockets;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import javax.imageio.ImageIO;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/websocket2")
public class WebSocket2 
{
	private
    static final Set<Session> sessions =
    Collections.synchronizedSet(new HashSet<Session>());

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        System.out.println("onOpen_File::" + session.getId());        
    }
    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
        System.out.println("onClose_File::" +  session.getId());
    }

    @OnMessage(maxMessageSize = 1024000)
    public void onMessage(byte[] data, Session session) {
        System.out.println("onByteArrayMessage::From=" + session.getId() + " with len:" + data.length );
        ByteArrayInputStream bis = new ByteArrayInputStream(data);
        BufferedImage bImage2;
        try 
        {
            bImage2 = ImageIO.read(bis);
            ImageIO.write(bImage2, "jpg", new File("output.jpg") );
        } 
        catch (IOException e1) 
        {
            e1.printStackTrace();
        }

        System.out.println("image created");

    }


    @OnError
    public void onError(Throwable t) {
        System.out.println("onError::" + t.getMessage());
    }

}
