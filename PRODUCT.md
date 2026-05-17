# Product Brief

## Working Name

Inventory App

## Problem

Restaurants often track low inventory on a whiteboard or by memory. The person placing the weekly order has to guess what was missed, how much is needed, and whether the team is over-ordering or under-ordering.

This leads to missed ingredients, emergency runs, food waste, inconsistent ordering, and extra stress during prep.

## Goal

Create a mobile app that lets restaurant teams quickly capture what is low, maintain simple inventory counts, and build smarter weekly order lists with suggested quantities.

## Target Users

- Kitchen managers
- Restaurant owners
- Prep leads
- Line cooks who notice low stock during service
- Small teams that do not want a heavy enterprise inventory system

## MVP Outcome

A single restaurant can use one phone or tablet to:

- Add low-stock notes throughout the week.
- Maintain an item list with units and par levels.
- Review a weekly order planner.
- See suggested order quantities.
- Export or share the order list.

## Suggestion Logic V1

Start with explainable local rules:

- If current quantity is below par, suggest the difference.
- Add a safety buffer for high-priority items.
- Respect vendor pack size when configured.
- Use recent low-stock notes as signal.
- Let the manager override every suggestion.

Future logic can include sales volume, day-of-week history, weather/events, menu mix, and vendor lead times.

## Business Direction

Launch as a practical mobile utility first. The app should be testable in real kitchens before paid integrations or complex team accounts are added.
