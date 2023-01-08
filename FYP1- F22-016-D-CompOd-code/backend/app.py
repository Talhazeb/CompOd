import os
import tempfile
import flask
from flask import request
from flask_cors import CORS
import whisper

import numpy as np
import pandas as pd
from SPARQLWrapper import SPARQLWrapper, JSON, N3
from rdflib import Graph

from flask import jsonify

# ========
import gensim
from gensim.test.utils import datapath
from gensim.models import KeyedVectors
from nltk.corpus import wordnet as wn
from nltk.tokenize import sent_tokenize
from nltk.tokenize import word_tokenize
# ======



app = flask.Flask(__name__)
CORS(app)

# ============================================================================================
def DB_pedia_SPARQL(query):
    sparql = SPARQLWrapper("http://dbpedia.org/sparql")
    sparql.setReturnFormat(JSON)

    sparql.setQuery(query)  # the previous query as a literal string

    return sparql.query().convert()

def query_generator(word):
    query1 = """
            PREFIX owl: <http://www.w3.org/2002/07/owl#> 
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> 
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
            PREFIX foaf: <http://xmlns.com/foaf/0.1/> 
            PREFIX dc: <http://purl.org/dc/elements/1.1/> 
            PREFIX : <http://dbpedia.org/resource/> 
            PREFIX dbpedia2: <http://dbpedia.org/property/> 
            PREFIX dbpedia: <http://dbpedia.org/> 
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
            PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> 
            PREFIX bif: <http://www.openlinksw.com/schemas/bif#> 
            """
    query2 = "SELECT DISTINCT ?concept ?conceptLabel WHERE {" + " ?s rdfs:label ?label ." + " FILTER (lang(?label) = 'en') ." + " ?label bif:contains \""+word+"\" . " + " ?s dbpedia-owl:wikiPageDisambiguates ?concept ." + " ?concept rdfs:label ?conceptLabel ." + " FILTER (regex(STR(?conceptLabel), \""+word+"\", \"i\")) ." + " FILTER (lang(?conceptLabel) = 'en')" + " }"
  #The query in a readable form
#  query2 = "SELECT DISTINCT ?concept ?conceptLabel WHERE {" 
#  + " ?s rdfs:label ?label ." 
#  + " FILTER (lang(?label) = 'en') ." 
#  + " ?label bif:contains \""+word+"\" . " 
#  + " ?s dbpedia-owl:wikiPageDisambiguates ?concept ." 
#  + " ?concept rdfs:label ?conceptLabel ." 
#  + " FILTER (regex(STR(?conceptLabel), \""+word+"\", \"i\")) ." 
#  + " FILTER (lang(?conceptLabel) = 'en')" 
#  + " }"
    query = query1 + query2
    return query


# ============================================================================================
#preload
def Symptoms_data():
    symptoms_query = """
            PREFIX dbo: <http://dbpedia.org/ontology/>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
            PREFIX foaf: <http://xmlns.com/foaf/0.1/>
            SELECT DISTINCT ?name
            WHERE
            {
              ?s dbo:symptom ?o.
              ?o rdfs:label|foaf:name ?name.
              FILTER(LANG(?name) = "en").
            }
    """

    results = DB_pedia_SPARQL(symptoms_query)
    temp = results['results']
    temp = temp['bindings']
    #print(temp)
    count = 0
    symptoms_list = []
    for i in temp:
        count = count + 1
        temp1 = i['name']
        symptoms_list.append(temp1['value'].lower())
    #print(symptoms_list)
    return symptoms_list

# ============================================================================================
def Medication_data():
    medication_query = """
            PREFIX dbo: <http://dbpedia.org/ontology/>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
            PREFIX foaf: <http://xmlns.com/foaf/0.1/>
            SELECT DISTINCT ?name
            WHERE
            {
              ?s dbo:medication ?o.
              ?o rdfs:label|foaf:name ?name.
              FILTER(LANG(?name) = "en").
            }
    """

    results = DB_pedia_SPARQL(medication_query)
    temp = results['results']
    temp = temp['bindings']
    #print(temp)
    count = 0
    medication_list = []
    for i in temp:
        count = count + 1
        temp1 = i['name']
        medication_list.append(temp1['value'].lower())
    print(count)
    
    return medication_list
#print(medication_list)

# ============================================================================================
def Disease_data():
    disease_query = """
            PREFIX dbo: <http://dbpedia.org/ontology/>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
            PREFIX foaf: <http://xmlns.com/foaf/0.1/>
            SELECT DISTINCT ?name
            WHERE
            {
              ?s dbo:symptom ?o.
              ?s rdfs:label|foaf:name ?name.
              FILTER(LANG(?name) = "en").
            }
    """

    results = DB_pedia_SPARQL(disease_query)
    temp = results['results']
    temp = temp['bindings']
    #print(temp)
    count = 0
    disease_list = []
    for i in temp:
        count = count + 1
        temp1 = i['name']
        disease_list.append(temp1['value'].lower())
    print(count) 
    #print(disease_list)
    
    return disease_list

# ============================================================================================
def Cause_data():
    cause_query = """
            PREFIX dbo: <http://dbpedia.org/ontology/>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
            PREFIX foaf: <http://xmlns.com/foaf/0.1/>
            SELECT DISTINCT ?name
            WHERE
            {
              ?s dbo:medicalCause ?o.
              ?o rdfs:label|foaf:name ?name.
              FILTER(LANG(?name) = "en")
            }
    """

    results = DB_pedia_SPARQL(cause_query)
    temp = results['results']
    temp = temp['bindings']
    #print(temp)
    count = 0
    cause_list = []
    for i in temp:
        count = count + 1
        temp1 = i['name']
        cause_list.append(temp1['value'].lower())
    print(count) 
    #print(disease_list)
    
    return cause_list

# ============================================================================================
def return_dictionary_dict():
    dictionary_dict = dict(
                {"a":0,"b":1,"c":2,"d":3,"e":4,"f":5,"g":6,"h":7,"i":8,"j":9,"k":10,"l":11,"m":12,"n":13,"o":14,"p":15,"q":16,"r":17,"s":18,"t":19,"u":20,"v":21,"w":22,"x":23,"y":24,"z":25,"-":26,"'":27," ":28,".":29,"?":30,"!":31,"1":32,"2":33,"3":34,"4":35,"5":36,"6":37,"7":38,"8":39,"9":40,"0":41}
    )
    return dictionary_dict

# ============================================================================================
#m-way tree, node
class Node:
    def __init__(self,data,word = 0):
        self.data = data
        self.word = word
        self.next = []
        self.dictionary_dict_size = len(return_dictionary_dict())
        
        for i in range(self.dictionary_dict_size):
            self.next.append(None)
            
# ============================================================================================
#m-way linked list
class LinkedList:
    def __init__(self):
        self.head = Node('',0)
    # insertion method for the linked list
    def insert(self, word):
        dictionary_dict = return_dictionary_dict()
        dictionary_dict_size = len(dictionary_dict)
        
        if (self.head) != None:
            head = self.head
            for i in range(len(word)):
                if i == len(word) - 1:
                    newNode = Node(word[i],1)
                else:
                    newNode = Node(word[i],0)
                    #Adding word
                try:
                    if head.next[dictionary_dict[word[i]]] == None:
                        head.next[dictionary_dict[word[i]]] = newNode
                    if newNode.word == 1:
                        head.next[dictionary_dict[word[i]]].word = 1
                    head = head.next[dictionary_dict[word[i]]]
                except:
                    # print("Exception thrown")
                    pass
        else:
            self.head = Node('',0)
    
    def search(self,word = ''):
        head = self.head
        dictionary_dict = return_dictionary_dict()
        dictionary_dict_size = len(dictionary_dict)
        
        for i in range(len(word)):
            #Searching
            try:
                if head.next[dictionary_dict[word[i]]] != None:
                    if i == len(word) - 1:
                        if head.next[dictionary_dict[word[i]]].word == 1:
                            return 1
                        else:
                            return 0
                else:
                    return 0
            except:
                return 0
            
            head = head.next[dictionary_dict[word[i]]]
    
    def autocorrect(self,word = '',correct_word = '',head = None,iteration = 0,prob = 100):
        dictionary_dict = return_dictionary_dict()
        dictionary_dict_size = len(dictionary_dict)
        
        List = list()
        if self.search(word) == 1:
            List.append(100)
            List.append(word)
            return List
        else:
#            print('correct word being checked is:',correct_word)
            if prob < 80:
                List.append(0)
                List.append('')
                return List
            elif head == None:
                List.append(0)
                List.append('')
                return List
            elif iteration == len(word):
                List.append(prob*head.word)
                List.append(correct_word)
                return List
            else:
                List1 = []
                List2 = []
                
                for i in range(dictionary_dict_size):
                    temp1 = []
                    temp2 = []
                    List1.append(temp1)
                    List2.append(temp2)
                
                keys = dictionary_dict.keys()
                
                for i in keys:
                    if word[iteration] == i:
                        if head.next[dictionary_dict[i]] != None:
                            List1[dictionary_dict[i]] = self.autocorrect(word,correct_word+i,head.next[dictionary_dict[i]],iteration+1,prob)
                            List2[dictionary_dict[i]] = self.autocorrect(word,correct_word+i,head.next[dictionary_dict[i]],iteration,prob-10)
                        else:
                            List1[dictionary_dict[i]] = self.autocorrect(word,correct_word+i,head.next[dictionary_dict[i]],iteration+1,prob-10)
                            List2[dictionary_dict[i]] = self.autocorrect(word,correct_word+i,head.next[dictionary_dict[i]],iteration,prob-10)
                    else:
                        List1[dictionary_dict[i]] = self.autocorrect(word,correct_word+i,head.next[dictionary_dict[i]],iteration+1,prob-10)
                        List2[dictionary_dict[i]] = self.autocorrect(word,correct_word+i,head.next[dictionary_dict[i]],iteration,prob-10)
               
                
                List = List1[0]
                for i in range(dictionary_dict_size):
                    if List[0] < List1[i][0]:
                        List = List1[i]
                    if List[0] < List2[i][0]:
                        List = List2[i] 
                    
                return List
                
            
            
    def printList(self,head = None,word = ''):
        dictionary_dict = return_dictionary_dict()
        dictionary_dict_size = len(dictionary_dict)
        
        if head == None:
            pass
        else:
            if head.word == 1:
                print(word+head.data)
            
            for i in range(dictionary_dict_size):
                self.printList(head.next[i],word+head.data)
        
# ============================================================================================
def w2n(word):
    dict_numb = dict()
    dict_teen = dict()
    dict_place = dict() 
    dict_scale = dict()

    dict_numb = {'zero':0,'one':1,'two':2,'three':3,'four':4,'five':5,'six':6,'seven':7,'eight':8,'nine':9}
    dict_teen = {'ten':10,'eleven':11,'twelve':12,'thirteen':13,'fourteen':14,'fifteen':15,'sixteen':16,'seventeen':17,'eighteen':18,'nineteen':19}
    dict_place = {'twenty':20,'thirty':30,'forty':40,'fifty':50,'sixty':60,'seventy':70,'eighty':80,'ninety':90}
    dict_scale = {'hundred':100,'thousand':1000,'million':1000000,'billion':1000000000}
    
    numb_keys = dict_numb.keys()
    teen_keys = dict_teen.keys()
    place_keys = dict_place.keys()
    scale_keys = dict_scale.keys()
    
    split_word = word.split()
    
    if split_word[0] not in numb_keys:
        if split_word[0] not in teen_keys:
            if split_word[0] not in place_keys:
                if split_word[0] not in scale_keys:
                    raise Exception("No numerical words to convert found")
                    return
        
    
    numb_list = list()
    numb = 0
    
    scale_condition = 0
    numb_condition = 0
    teen_condition = 0
    place_condition = 0
    
    
    temp_numb = 0
    for i in split_word:
        if i in scale_keys:
            if temp_numb != 0:
                temp_numb = temp_numb*dict_scale[i]
            else:
                temp_numb = dict_scale[i]
            scale_condition = 1
        elif i not in scale_keys:
            if scale_condition == 1:
                numb_list.append(temp_numb)
                temp_numb = 0
                scale_condition = 0
                numb_condition = 0
                teen_condition = 0
                place_condition = 0
            #numb    
            if i in numb_keys:
                if numb_condition == 1:
                    temp_numb = (temp_numb*10) + dict_numb[i]
                    numb_condition = 1
                elif teen_condition == 1:
                    temp_numb = (temp_numb*10) + dict_numb[i]
                    teen_condition = 0
                    numb_condition = 1
                elif place_condition == 1:
                    temp_numb = temp_numb + dict_numb[i]
                    numb_condition = 1
                    place_condition = 0
                else:
                    temp_numb = dict_numb[i]
                    numb_condition = 1
            #teen        
            elif i in teen_keys:
                if numb_condition == 1:
                    temp_numb = (temp_numb*100) + dict_teen[i]
                    teen_condition = 1
                    numb_condition = 0
                elif teen_condition == 1:
                    temp_numb = (temp_numb*100) + dict_teen[i]
                    teen_condition = 1
                elif place_condition == 1:
                    temp_numb = (temp_numb*100) + dict_teen[i]
                    teen_condition = 1
                    place_condition = 0
                else:
                    temp_numb = dict_teen[i]
                    teen_condition = 1
            #place        
            elif i in place_keys:
                if numb_condition == 1:
                    temp_numb = (temp_numb*100) + dict_place[i]
                    place_condition = 1
                    numb_condition = 0
                elif teen_condition == 1:
                    temp_numb = (temp_numb*100) + dict_place[i]
                    teen_condition = 0
                    place_condition = 1
                elif place_condition == 1:
                    temp_numb = (temp_numb*100) + dict_place[i]
                    place_condition = 1
                else:
                    temp_numb = dict_place[i]
                    place_condition = 1
            else:
                pass
                    
    numb_list.append(temp_numb)
                    
    for i in numb_list:
        numb = numb + i
    return numb
            
            
# ============================================================================================
#loading the cleaned piority english dictionary and populating it
#This will contain general frequent english words
def piority_dict():
    symptoms_list = Symptoms_data()
    medication_list = Medication_data()
    disease_list = Disease_data()
    cause_list = Cause_data()
    
    piority_eng_dict = LinkedList()

    piority_eng_dictionary_file = 'piority_english_dictionary.txt'
    piority_eng_dictionary = pd.read_csv(piority_eng_dictionary_file, sep="*", header=None)

    #print(piority_eng_dictionary)

    for word in piority_eng_dictionary[0]:
        if (isinstance(word, str)):
            piority_eng_dict.insert(word.lower())
            
    for word in symptoms_list:
        piority_eng_dict.insert(str(word).lower())
    
    for word in medication_list:
        piority_eng_dict.insert(str(word).lower())
    
    for word in disease_list:
        piority_eng_dict.insert(str(word).lower())
        
    for word in cause_list:
        piority_eng_dict.insert(str(word).lower())
            
    return piority_eng_dict

#  ============================================================================================
#loading the cleaned open english dictionary and populating it
def open_dict():
    open_eng_dict = LinkedList()
    open_eng_dictionary = pd.read_csv("english_dictionary.txt", sep="*", header=None)
    for word in open_eng_dictionary[0]:
        open_eng_dict.insert(str(word).lower())
            
    return open_eng_dict 

# ============================================================================================
#loading the report file
def Report():
    report_file = 'medical_report.csv'
    report = pd.read_csv(report_file)

    report['Attribute'] = report['Attribute'].str.lower()
    report['Key Word'] = report['Key Word'].str.lower()
    report['Data Type'] = report['Data Type'].str.lower()

    return report

# ============================================================================================
def auto_correct(transcription, open_eng_dict,piority_eng_dict):
    split_transcription = transcription.split()
    transcription = ''
    for i in split_transcription:
        if piority_eng_dict.search(i) == 0 and open_eng_dict.search(i) == 0:
            List = piority_eng_dict.autocorrect(i,'',piority_eng_dict.head)
            if List[0] == 0:
                List = open_eng_dict.autocorrect(i,'',open_eng_dict.head)
    #        print("Word is:",i,"Correct word is:",List[1])
            transcription = transcription + ' '+ List[1]
        else:
    #        print("Word is:",i)
            transcription = transcription + ' '+ i
    return transcription

# ============================================================================================
def paragraph2numb(transcription):
    split_transcription = transcription.split()
    transcription = ''

    prev = ''
    current = ''
    numb = ''
    for i in range(len(split_transcription)):
        numb = numb +' '+ split_transcription[i]
    
    #    print("So, the string in question is:",numb)
    
        try:
            prev = current
            current = str(w2n(numb))
    #        print(current)
        
            if prev == current:
                if split_transcription[i] == 'and':
                    pass
                else:
                    transcription = transcription +' '+ current
                    transcription = transcription +' '+ split_transcription[i]
                    numb = ''
                    prev = ''
                    current = ''
        except:
    #        print("I am in except")
            transcription = transcription + numb
            numb = ''
    return transcription

# ============================================================================================
class extraction_model:
    def __init__(self, symptoms_list,medication_list,disease_list,cause_list,neg_tokens):
        self.symptoms_list = symptoms_list
        self.medication_list = medication_list
        self.disease_list = disease_list
        self.cause_list = cause_list
        
        self.neg_tokens = neg_tokens
        
        self.dict = dict()
        self.dict["temperature"] = 0
        self.dict["blood pressure"] = list()
        self.dict["symptoms"] = set()
        self.dict["medication"] = set()
        self.dict["disease"] = set()
        self.dict["cause"] = set()
        
    def predict(self,sentence):
        self.temp_predict(sentence)
        self.bp_predict(sentence)
        words = word_tokenize(sentence)
        for i in range(len(words)):
            if words[i] not in self.neg_tokens:
                if i < len(words)-1:
                    self.prediction(words[i],words[i+1],sentence)
                else:
                    self.prediction(words[i],"",sentence)
    def prediction(self,word,word2,context):
        if word not in self.symptoms_list:
            if word not in self.medication_list:
                if word not in self.disease_list:
                    if word not in self.cause_list:
                        condition1 = self.wordnet_prediction(word)
                        condition2 = self.wordnet_prediction(word+"_"+word2)
                        if condition1 == 0 and condition2 == 0:
                            try:
                                self.word2vec_prediction(word+"_NOUN")
                            except:
                                pass
                            try:
                                self.word2vec_prediction(word+"::"+word2+"_NOUN")
                            except:
                                pass
                        else:
                            pass
                    else:
                        temp = self.dict["cause"]
                        temp.add(word)
                        self.dict["cause"] = temp
                else:
                    temp = self.dict["disease"]
                    temp.add(word)
                    self.dict["disease"] = temp
            else:
                temp = self.dict["medication"]
                temp.add(word)
                self.dict["medication"] = temp
        else:
            temp = self.dict["symptoms"]
            temp.add(word)
            self.dict["symptoms"] = temp
                    
    def word2vec_prediction(self,word):
        if wv.similarity('medicine_NOUN', word) > 0.5:
            temp = self.dict["medication"]
            temp.add(word)
            self.dict["medication"] = temp
        if wv.similarity('disease_NOUN', word) > 0.5:
            temp = self.dict["disease"]
            temp.add(word)
            self.dict["disease"] = temp
        if wv.similarity('symptom_NOUN', word) > 0.5:
            temp = self.dict["symptoms"]
            temp.add(word)
            self.dict["symptoms"] = temp
        if wv.similarity('cause_NOUN', word) > 0.5:
            temp = self.dict["cause"]
            temp.add(word)
            self.dict["cause"] = temp

    def wordnet_prediction(self,word):   
        temp0 = wn.synsets(word)
        temp1 = wn.synsets('symptom')
        temp2 = wn.synsets('medicine')
        temp3 = wn.synsets('disease')
        condition = 0
        for i in temp0:
            for j in temp1:
                if i.wup_similarity(j) > 0.7:
                    condition = 1
                    temp = self.dict["symptoms"]
                    temp.add(word)
                    self.dict["symptoms"] = temp
            for k in temp2:
                if i.wup_similarity(k) > 0.7:
                    condition = 1
                    temp = self.dict["medication"]
                    temp.add(word)
                    self.dict["medication"] = temp
            for l in temp3:
                if i.wup_similarity(l) > 0.7:
                    condition = 1
                    temp = self.dict["disease"]
                    temp.add(word)
                    self.dict["disease"] = temp
        return condition
    def temp_predict(self,sentence):
        if "temperature" in sentence:
            words = sentence.split()
            for word in words:
                if type(word) == int:
                    self.dict["temperature"] = word
    def bp_predict(self,sentence):
        if "blood pressure" in sentence:
            words = sentence.split()
            for word in words:
                if type(word) == int:
                    temp = self.dict["blood pressure"]
                    temp.add(word)
                    self.dict["blood pressure"] = temp

    # Create a dictionary of the report like this
    # report_dict = {"Symptoms":symp_list,"Medication":med_list,"Disease":dis_list,"Cause":cause_list}
    # print("The report dictionary is:")
    # print(report_dict)  
    # return report_dict          
# ============================================================================================

#main
#preloading
wv = KeyedVectors.load_word2vec_format("model.bin",binary=True)
neg_tokens = ["not","n't"]
#Different medical data from ontology
symptoms_list = Symptoms_data()
# print(symptoms_list)
medication_list = Medication_data()
# print(medication_list)
disease_list = Disease_data()
# print(disease_list)
cause_list = Cause_data()
# print(cause_list)
#report
mdl = extraction_model(symptoms_list,medication_list,disease_list,cause_list,neg_tokens)
report =Report()

#Dictionaries
piority_eng_dict = piority_dict()
open_eng_dict = open_dict()
#preloading complete

# #on spot
# #loading the audio file (this part will be replaced by a stream of data like somewhat live)
# audio_file_name = '/content/drive/MyDrive/Colab Notebooks/working/my-audio2.wav'
# transcription = Nemo(asr_model,audio_file_name)
# print(transcription)
# transcription = auto_correct(transcription, open_eng_dict,piority_eng_dict)
# print(transcription)
# transcription = paragraph2numb(transcription)
# print(transcription)
# report_model(report['Attribute'],report['Key Word'],report['Data Type'],report['inputs'],report['RangeL'],report['RangeU'],symptoms_list,medication_list,disease_list,cause_list)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if request.method == 'POST':
        language = request.form['language']
        model = request.form['model_size']

        # there are no english models for large
        if model != 'large' and language == 'english':
            model = model + '.en'
        audio_model = whisper.load_model(model)

        temp_dir = tempfile.mkdtemp()
        save_path = os.path.join(temp_dir, 'temp.wav')

        wav_file = request.files['audio_data']
        wav_file.save(save_path)

        result = audio_model.transcribe("audio.wav", language='english')
        
        transcription = result['text']
        print(transcription)
        
        mdl.predict(transcription)
        
        # transcription = auto_correct(transcription, open_eng_dict,piority_eng_dict)
        # print(transcription)
        # transcription = paragraph2numb(transcription)
        # print(transcription)
        
        print("The report dictionary isasdads:")
        
        data = dict()
        
        data["temperature"] = mdl.dict["temperature"]
        data["blood pressure"] = mdl.dict["blood pressure"]   
        data["symptoms"] = list(mdl.dict["symptoms"])
        data["medication"] = list(mdl.dict["medication"])
        data["disease"] = list(mdl.dict["disease"])
        data["cause"] = list(mdl.dict["cause"])  
        
        rpt= data
        return jsonify({'transcription': transcription, 'report': rpt})
            #     return result['text']
            # else:
            #     return "This endpoint only processes POST wav blob"
