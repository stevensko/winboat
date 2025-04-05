package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os/exec"

	"github.com/gorilla/mux"
)

func getApps(w http.ResponseWriter, r *http.Request) {
	// Run the PowerShell script
	cmd := exec.Command("powershell", "-ExecutionPolicy", "Bypass", "-File", "apps.ps1")
	output, err := cmd.Output()
	if err != nil {
		http.Error(w, "Failed to execute script: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Set JSON headers and send the raw output
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(output)
}

func getHealth(w http.ResponseWriter, r *http.Request) {
	// Simple health check response
	response := map[string]string{"status": "ok"}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/apps", getApps).Methods("GET")
	r.HandleFunc("/health", getHealth).Methods("GET")

	log.Println("Starting server on :7148...")
	if err := http.ListenAndServe(":7148", r); err != nil {
		log.Fatal("Server failed: ", err)
	}
}