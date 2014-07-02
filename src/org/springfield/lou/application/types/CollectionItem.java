package org.springfield.lou.application.types;

import java.util.UUID;

import org.json.simple.JSONObject;

public class CollectionItem {
	
	private String id = UUID.randomUUID().toString(); 
	private String contents;
	private int weight;
	
	public CollectionItem(String contents, int weight) {
		this.contents = contents;
		this.weight = weight;
	}
	
	public CollectionItem(JSONObject object){
		this.contents = (String) object.get("contents");
		this.weight = Integer.parseInt((String) object.get("weight"));
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getContents() {
		return contents;
	}

	public void setContents(String contents) {
		this.contents = contents;
	}

	public int getWeight() {
		return weight;
	}

	public void setWeight(int weight) {
		this.weight = weight;
	}

	public JSONObject getJSON(){
		JSONObject object = new JSONObject();
		object.put("id", id);
		object.put("contents", contents);
		
		try{
			object.put("weight", weight);
		}catch(NumberFormatException nfe){
			object.put("weight", 1);
		}
		
		return object;
	};

}
