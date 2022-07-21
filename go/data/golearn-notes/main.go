package main

import (
	"fmt"
	"strings"

	"github.com/sjwhitworth/golearn/base"
	"github.com/sjwhitworth/golearn/evaluation"
	"github.com/sjwhitworth/golearn/knn"
)

func main() {
	printSectionTitle("basic data loading")
	basicDataLoading()

	printSectionTitle("basic knn classification")
	basicKNN()
}

func basicDataLoading() {
	di, err := base.ParseCSVToInstances("data/iris.csv", true)
	if err != nil {
		panic(err)
	}
	fmt.Println(di.AllAttributes())
}

func basicKNN() {
	// Load data
	di, err := base.ParseCSVToInstances("data/iris.csv", true)
	if err != nil {
		panic(err)
	}
	// Create classifier
	knn := knn.NewKnnClassifier("euclidean", "linear", 4)
	// Train-test split
	trainData, testData := base.InstancesTrainTestSplit(di, .6)
	fmt.Println(trainData)
	// Normalize
	// TODO
	// Fit model
	err = knn.Fit(trainData)
	if err != nil {
		panic(err)
	}
	// Use model (predict)
	predictions, err := knn.Predict(testData)
	if err != nil {
		panic(err)
	}
	// Evaluate predictions (confusion matrix)
	cm, err := evaluation.GetConfusionMatrix(testData, predictions)
	if err != nil {
		panic(err)
	}
	// Log results
	fmt.Println(evaluation.ShowConfusionMatrix(cm))
	fmt.Println(evaluation.GetSummary(cm))
}

// ---
// Helpers
// ---

func printSectionTitle(title string) {
	fmt.Println("")
	fmt.Println(strings.ToUpper(title))
	fmt.Println("")
}
