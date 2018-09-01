Class GameField Implements CardHideListener, TimerCompleteListener

	Method Update:Void()
		If (MouseHit() And Timers.IsEmpty()) Then
			If (MouseX() >= x And MouseX() <= x + width And MouseY() >= y And MouseY() <= y + height) Then
				Local mx:Float = MouseX()
				Local my:Float = MouseY()
			
				For Local card:Card = EachIn cards
					If (mx >= x + card.x And mx <= x + card.x + card.width And my >= y + card.y And my <= y + card.y + card.height) Then
						If ( Not card.flipped And card.Flip()) Then
							If (selected[0] = Null) Then
								selected[0] = card
							Else
								selected[1] = card
							End If
						End If
						
						Exit
					End If
				Next
			End If
		End If
	End Method

End Class