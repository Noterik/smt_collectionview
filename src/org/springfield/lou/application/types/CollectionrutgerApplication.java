package org.springfield.lou.application.types;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Observable;
import java.util.Observer;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Node;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.springfield.lou.application.Html5Application;
import org.springfield.lou.application.components.ComponentManager;
import org.springfield.lou.fs.FSXMLStrainer;
import org.springfield.lou.fs.Fs;
import org.springfield.lou.fs.FsNode;
import org.springfield.lou.fs.IncorrectFilterException;
import org.springfield.lou.fs.NodeObserver;
import org.springfield.lou.homer.LazyHomer;
import org.springfield.lou.homer.LazyMarge;
import org.springfield.lou.screen.Screen;

public class CollectionrutgerApplication extends Html5Application implements Observer{

	private FSXMLStrainer collectionStrainer;
	private Map<String, Integer> chunksForScreens;
	private int chunkSize = 50;
	private String observingUri;
	
	private Comparator<Node> titleComparator = new Comparator<Node>(){
		@Override
		public int compare(Node arg0, Node arg1) {
			try{
				String title0 = arg0.selectSingleNode("properties/title").getText();
				String title1 = arg1.selectSingleNode("properties/title").getText();
				return title0.compareTo(title1);
			}catch(Exception e){
				return -1;
			}
		}
	};
		
 	public CollectionrutgerApplication(String id) {
		super(id); 
		
		chunksForScreens = new HashMap<String, Integer>();
		try {
			Document filterDocument = DocumentHelper.parseText("<filter><include><node id=\"video\"><include><property id=\"description\" /><property id=\"title\" /><property id=\"screenshot\" /></include></node></include></filter>");
			collectionStrainer = new FSXMLStrainer(filterDocument);
		} catch (IncorrectFilterException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (DocumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
	}
	
	public void onNewScreen(Screen s) {
		System.out.println("-----------------------NEWSCREEN-------------------------");
		System.out.println("CollectionrutgerApplication.onNewScreen()");
		if(this.observingUri != null){
			this.unsubscribe(this.observingUri);
		}
		this.observingUri = s.getParameter("uri");
		System.out.println("OBSERVING URI:" + observingUri);
		System.out.println("COLLECTION STRAINER: " + collectionStrainer);
		this.subscribe(this.observingUri, collectionStrainer);
		System.out.println("----------------------END NEWSCREEN----------------------");
		initializeScreen(s);
	}
	
	private void initializeScreen(Screen s){
		loadStyleSheet(s,appname);
		s.setRole("mainscreen");
		loadContent(s, "font");
		loadContent(s, "controller");
		loadContent(s, "collectionview");
		loadContent(s, "terms");
		loadContent(s, "topbar");
		loadContent(s, "playeroverlay");
		
		this.chunksForScreens.put(s.getId(), 0);
		getNextChunk(s);
	}

	public void putOnScreen(Screen s, String from, String msg) {
		System.out.println("CollectionApplication.putOnScreen(" + s + ", " + from + "," + msg + ")");
        int pos = msg.indexOf("(");
        if (pos!=-1) {
            String command = msg.substring(0,pos);
            String content = msg.substring(pos+1,msg.length()-1);
            System.out.println("CONTENT: " + content);
            JSONObject params = (JSONObject) JSONValue.parse(content);
            try {
            	System.out.println("COMMAND: " + command);
            	System.out.println("PARAMS: " + params);
            	Method method;
            	if(params != null){
            		method = this.getClass().getMethod(command, Screen.class, JSONObject.class);
            		method.invoke(this, s, params);
            	}else{
            		method = this.getClass().getMethod(command, Screen.class);
            		method.invoke(this, s);
            	}
            	
        	} catch (SecurityException e) {
        		e.printStackTrace();
        	} catch (NoSuchMethodException e) {
        		e.printStackTrace();
        	} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
 	}
	
	public void getNextChunk(Screen s){
		System.out.println("CollectionApplication.loadNextChunk(" + s.getId() + ")");
		int chunk = 1;
		if(chunksForScreens.containsKey(s.getId())){
			chunk = chunksForScreens.get(s.getId()) + 1;
		}
		chunksForScreens.put(s.getId(), chunk);
		int start = (chunk - 1) * chunkSize;
		int end = chunk * chunkSize;
		s.putMsg("collectionview", "app", "appendItems(" + this.observingNodes.get(this.observingUri).get("//video[position() >= " + start + " and position() < " + end + "]").asXML() + ")");
	}
	
	public void sortByTitle(Screen s, JSONObject params){
		System.out.println("CollectionApplication.sortByTitle(" + s.getId() + ", " + params + ")");
		try{
			s.putMsg("collectionview", "app", "loading(true)");
			NodeObserver.OrderDirection directionVal;
			String direction = (String) params.get("direction");
			if(direction.equals("asc")){
				directionVal = NodeObserver.OrderDirection.ASC;
			}else{
				directionVal = NodeObserver.OrderDirection.DESC;
			}
			NodeObserver node = this.observingNodes.get(this.observingUri);
			this.observingNodes.get(this.observingUri).setOrder(titleComparator, directionVal);
			s.putMsg("collectionview", "app", "clear()");
			chunksForScreens.remove(s.getId());
			this.getNextChunk(s);
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	@Override
	public void update(Observable o, Object arg) {
		System.out.println("Collection changed!");
		// TODO Auto-generated method stub
		ComponentManager manager = this.componentmanager;
		JSONObject updateParams = (JSONObject) arg;
		System.out.println(updateParams);
		if(arg != null){
			manager.getComponent("collection").put("app", "update(" + updateParams + ")");
		}
	}
	
	public void changeLayout(Screen s, JSONObject params){
		System.out.println("CollectionApplication.changeLayout(" + params + ")");
		s.putMsg("collectionview", "app", "loading(true)");
		String layout = (String) params.get("layout");
		s.putMsg("collectionview", "app", "changeLayout(" + layout + ")");
		s.putMsg("collectionview", "app", "clear()");
		chunksForScreens.remove(s.getId());
		this.getNextChunk(s);
	}
	
	public void playVideo(Screen s, JSONObject params){
		System.out.println("CollectionrutgerApplication.playVideo()");
		String path = (String) params.get("path");
		String fullPath = this.observingUri + "/" +path + "/rawvideo/1";
		FsNode node = Fs.getNode(fullPath);
		String mount = node.getProperty("mount");
		String[] splits = mount.split(",");
		
		JSONObject message = new JSONObject();
		message.put("video", splits[0]);
		
		String command = "setVideo(" + message + ")";
		s.putMsg("playeroverlay", "", command);
	}
}
