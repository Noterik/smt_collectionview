package org.springfield.lou.application.types;

import java.awt.Color;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Observable;
import java.util.Observer;
import java.util.Random;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class Collection extends Observable{
	public ArrayList<CollectionItem> items = new ArrayList<CollectionItem>();
	
	public Collection(){
		
		for(int i = 0; i < 30; i++){
			if(Math.random() < 0.5){
				items.add(generateColorItem(i));
			}else{
				items.add(generateImageItem(i));
			}
		}
	}
	
	private CollectionItem generateColorItem(int number){
		Random rand = new Random();
		float r = rand.nextFloat();
		float g = rand.nextFloat();
		float b = rand.nextFloat();
		Color color = new Color(r, g, b);
		int weight = rand.nextInt(4) + 1;
		String contents = "<div style=\"background-color: " + String.format("#%02x%02x%02x", color.getRed(), color.getGreen(), color.getBlue()) +  ";\"></div>";
		return new CollectionItem(contents, weight);
	}
	
	private CollectionItem generateImageItem(int number){
		Random rand = new Random();
		int imageNumber = rand.nextInt(16) + 1;
		int weightPercentage = rand.nextInt(100) + 1;
		int weight;
		if(weightPercentage < 70){
			weight = 1;
		}else{
			weight = 2;
		}
		String contents = "<img src=\"/eddie/img/collection/" + imageNumber + ".jpg\" />";
		return new CollectionItem(contents, weight);
	}
	
	public JSONObject getJSON(){
		JSONObject object = new JSONObject();
		
		ArrayList<JSONObject> jsonItems = new ArrayList<JSONObject>();
		for(Iterator<CollectionItem> i = items.iterator(); i.hasNext();){
			jsonItems.add(i.next().getJSON());
		}
		object.put("items", jsonItems);
		
		return object;
	}
	
	public CollectionItem get(String id){
		for(Iterator<CollectionItem> i = this.items.iterator(); i.hasNext();){
			CollectionItem next = i.next();
			if(next.getId().equals(id)){
				return next;
			};
		}
		return null;
	}

	public boolean add(CollectionItem e) {
		System.out.println("Collection.add()");
		// TODO Auto-generated method stub
		if(items.add(e)){
			System.out.println("---- item added!");
			this.setChanged();
			JSONArray added = new JSONArray();
			added.add(e.getJSON());
			JSONObject updateContent = new JSONObject();
			updateContent.put("index", -1);
			updateContent.put("items", added);
			JSONObject update = new JSONObject();
			update.put("added", updateContent);
			this.notifyObservers(update);
			return true;
		}
		return false;
	}
	
	public JSONObject getAll(){
		JSONArray added = new JSONArray();
		for(Iterator<CollectionItem> i = items.iterator(); i.hasNext();){
			added.add(i.next().getJSON());
		}	
		JSONObject updateContent = new JSONObject();
		updateContent.put("index", -1);
		updateContent.put("items", added);
		JSONObject update = new JSONObject();
		update.put("added", updateContent);
		return update;
	}
	
	public boolean remove(CollectionItem e){
		int index = items.indexOf(e);
		if(items.remove(e)){
			this.setChanged();
			JSONArray removed = new JSONArray();
			removed.add(e.getJSON());
			JSONObject updateContent = new JSONObject();
			updateContent.put("index", index);
			updateContent.put("items", removed);
			JSONObject update = new JSONObject();
			update.put("removed", updateContent);
			this.notifyObservers(update);
			return true;
		}
		return false;
	}
	
	public void add(int index, CollectionItem e){
		if(index == -1){
			items.add(e);
		}else{
			items.add(index, e);
		}
		JSONArray added = new JSONArray();
		added.add(e.getJSON());
		JSONObject updateContent = new JSONObject();
		updateContent.put("index", index);
		updateContent.put("items", added);
		JSONObject update = new JSONObject();
		update.put("added", updateContent);
		this.setChanged();
		this.notifyObservers(update);
	}

	@Override
	public void notifyObservers() {
		System.out.println("Collection.notifyObservers()");
		// TODO Auto-generated method stub
		JSONArray added = new JSONArray();
		for(Iterator<CollectionItem> i = this.items.iterator(); i.hasNext();){
			added.add(i.next().getJSON());
		}
		JSONObject updateMessage = new JSONObject();
		updateMessage.put("added", added);
		this.setChanged();
		super.notifyObservers(updateMessage);
	}
}
