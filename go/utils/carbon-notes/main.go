package main

import (
	"fmt"
	"strings"
	"time"

	"github.com/golang-module/carbon/v2"
)

// ---
// Main
// ---

func main() {
	printSectionTitle("basicNow")
	basicNow()

	printSectionTitle("basicTime")
	basicTime()

	printSectionTitle("basicString")
	basicString()

	printSectionTitle("basicShift")
	basicShift()

	printSectionTitle("basicDifference")
	basicDifference()

	printSectionTitle("basicCompareDistance")
	basicCompareDistance()

	printSectionTitle("basicChecks")
	basicChecks()

	printSectionTitle("basicGet")
	basicGet()

	printSectionTitle("basicSet")
	basicSet()

	printSectionTitle("basicTz")
	basicTz()
}

// ---
// Utils
// ---

func printSectionTitle(title string) {
	fmt.Println("")
	fmt.Println(strings.ToUpper(title))
	fmt.Println("")
}

// ---
// Examples
// ---

func basicNow() {
	now := carbon.Now()
	fmt.Println(now)
}

func basicTime() {
	now := time.Now()
	fmt.Println("time.Time:", now)

	// time -> carbon
	nowCarbon := carbon.CreateFromStdTime(now)
	fmt.Println("time -> carbon:", nowCarbon)

	// carbon -> time
	now2 := nowCarbon.StdTime()
	fmt.Println("carbon -> time:", now2)
}

func basicString() {
	now := carbon.Now()

	// Export
	fmt.Println("String:", now.String())                     // YYYY-MM-DD hh:mm:ss
	fmt.Println("ToString:", now.ToString())                 // YYYY-MM-DD hh:mm:ss (with utc offset)
	fmt.Println("ToDateString:", now.ToDateString())         // YYYY-MM-DD
	fmt.Println("ToTimeString:", now.ToTimeString())         // hh:mm:ss
	fmt.Println("ToDateTimeString:", now.ToDateTimeString()) // YYYY-MM-DD hh:mm:ss
	fmt.Println("Timestamp:", now.Timestamp())               // Seconds timestamp (also milli, micro)
	fmt.Println("Format:", now.Format("Y-m-d H:i:s"))        // Custom format

	// Parse
	fmt.Println("Parse:", carbon.Parse("2020-01-01"))
	fmt.Println("ParseByFormat:", carbon.ParseByFormat("2020-01-01", "Y-m-d"))
}

func basicShift() {
	now := carbon.Now()
	fmt.Println("Now:", now)

	fmt.Println("Yesterday:", now.Yesterday())
	fmt.Println("Tomorrow:", now.Tomorrow())

	// Add
	fmt.Println("AddSeconds:", now.AddSeconds(1))
	fmt.Println("AddMinutes:", now.AddMinutes(1))
	fmt.Println("AddHours:", now.AddHours(1))
	fmt.Println("AddDays:", now.AddDays(1))
	fmt.Println("AddMonths:", now.AddMonths(1))
	fmt.Println("AddYears:", now.AddYears(1))
	fmt.Println("AddDecades:", now.AddDecades(1))
	fmt.Println("AddCenturies:", now.AddCenturies(1))

	// Sub
	fmt.Println("SubSeconds:", now.SubSeconds(1))
	fmt.Println("SubMinutes:", now.SubMinutes(1))
	fmt.Println("SubHours:", now.SubHours(1))
	fmt.Println("SubDays:", now.SubDays(1))
	fmt.Println("SubMonths:", now.SubMonths(1))
	fmt.Println("SubYears:", now.SubYears(1))
	fmt.Println("SubDecades:", now.SubDecades(1))
	fmt.Println("SubCenturies:", now.SubCenturies(1))

	// Boundaries (century, decade, year, month, week, day, hour, minute, second)
	fmt.Println("StartOfDay:", now.StartOfDay())
	fmt.Println("EndOfDay:", now.EndOfDay())
}

func basicDifference() {
	today := carbon.Now()
	yearFromToday := today.AddYears(1)

	// a.DiffInYears(b) // b - a

	fmt.Println("DiffInYears:", today.DiffInYears(yearFromToday))
	fmt.Println("DiffInMonths:", today.DiffInMonths(yearFromToday))
	fmt.Println("DiffInWeeks:", today.DiffInWeeks(yearFromToday))
	fmt.Println("DiffInDays:", today.DiffInDays(yearFromToday))
	fmt.Println("DiffInHours:", today.DiffInHours(yearFromToday))
	fmt.Println("DiffInMinutes:", today.DiffInMinutes(yearFromToday))
	fmt.Println("DiffInSeconds:", today.DiffInSeconds(yearFromToday))
}

func basicCompareDistance() {
	today := carbon.Now()
	monthFromToday := today.AddMonths(1)
	yearFromToday := today.AddYears(1)

	fmt.Println("Closest:", today.Closest(monthFromToday, yearFromToday))
	fmt.Println("Farthest:", today.Farthest(monthFromToday, yearFromToday))
}

func basicChecks() {
	fmt.Println("...")
	// IsValid
	// IsFuture/IsPast
	// IsWeekday/IsWeekend
	// Is[month]/Is[day]
	// IsSame[Unit]
	// Eq/Ne/Gt(e)/Lt(e)
	// Between/BetweenIncluded[edge]
}

func basicGet() {
	now := carbon.Now()

	fmt.Println("MonthOfYear", now.MonthOfYear())
	fmt.Println("WeekOfYear", now.WeekOfYear())
	fmt.Println("DayOfYear", now.DayOfYear())

	fmt.Println("WeekOfMonth", now.WeekOfMonth())
	fmt.Println("DayOfMonth", now.DayOfMonth())

	fmt.Println("DayOfWeek", now.DayOfWeek())

	(func() {
		year, month, day, hour, minute, second := now.DateTime()
		fmt.Println("DateTime", []int{year, month, day, hour, minute, second})
	})()

	(func() {
		year, month, day := now.Date()
		fmt.Println("DateTime", []int{year, month, day})
	})()
}

func basicSet() {
	now := carbon.Now()
	fmt.Println("SetTime", now.SetTime(0, 0, 0))
	fmt.Println("SetDate", now.SetDate(2020, 1, 1))

	// SetYear/SetMonth/SetDay
	// SetHour/SetMinute/SetSecond/SetMillisecond/SetMicrosecond/SetNanosecond
}

func basicTz() {
	fmt.Println("...")
}
